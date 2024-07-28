import { DateTime } from "luxon";
import { collectLinkedPullRequests } from "../handlers/collect-linked-pulls";
import { Context } from "../types/context";
import { getProjectUrls } from "./get-env";
import { parseGitHubUrl } from "./github-url";
import { ListForOrg, ListIssueForRepo } from "../types/github-types";

export async function updateTasks(context: Context) {
  const {
    logger,
    config: { watch }
  } = context;

  const { projectUrls, repos } = await getProjectUrls(context, watch);

  if (!projectUrls?.length && !repos?.length) {
    logger.info("No watched repos have been found, no work to do.");
    return false;
  }

  for (const repo of repos) {
    await updateReminders(context, repo);
  }

  return true;
}

async function updateReminders(context: Context, repo: ListForOrg["data"][0]) {
  const {
    octokit
  } = context;
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: repo.owner.login,
    repo: repo.name,
    per_page: 100,
  }) as ListIssueForRepo[];

  for (const issue of issues) {
    await updateReminderForIssue(context, repo, issue);
  }
}

async function updateReminderForIssue(context: Context, repo: ListForOrg["data"][0], issue: ListIssueForRepo) {
  const {
    logger,
    config,
    payload,
    octokit
  } = context;
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner: repo.owner.login,
    repo: repo.name,
    issue_number: issue.number,
    per_page: 100,
  })
  const botComments = comments.filter((o) => o.user?.type === "Bot");
  // Mon, Jul 22, 10:25 PM UTC
  const dateRegex = /(\w{3}, \w{3} \d{1,2}, \d{4}, \d{1,2}:\d{2} (AM|PM) UTC)/;
  // capturing via the metadata comment
  const assignmentRegex = /Ubiquity - Assignment - start -/gi;
  const botAssignmentComments = sortAndReturn(botComments.filter((o) => assignmentRegex.test(o?.body || "")), "desc");
  const lastCheck = DateTime.fromISO(botAssignmentComments[0].created_at)
  const deadline = DateTime.fromISO(botAssignmentComments[0].body.match(dateRegex)[0]);

  const now = DateTime.now();
  const activity = (await getAssigneesActivityForIssue(context, issue)).filter(
    (o) =>
      payload.issue?.assignees?.find((assignee) => assignee?.login === o.actor.login) && DateTime.fromISO(o.created_at) >= lastCheck
  );

  const deadlineWithThreshold = deadline.plus({ milliseconds: config.disqualification });
  const reminderWithThreshold = deadline.plus({ milliseconds: config.warning });

  if (activity?.length) {
    const timeDiff = now.diff(lastCheck);
    const newDeadline = deadline.plus(timeDiff);
    logger.info(
      `Activity found on ${issue.url}, will move the deadline forward from ${deadline.toLocaleString(DateTime.DATETIME_MED)} to ${newDeadline.toLocaleString(DateTime.DATETIME_MED)}`
    );
  } else {
    if (now >= deadlineWithThreshold) {
      await unassignUserFromIssue(context, issue);
    } else if (now >= reminderWithThreshold) {
      await remindAssigneesForIssue(context, issue);
    } else {
      logger.info(
        `Nothing to do for ${issue.url}, still within due-time (now: ${now.toLocaleString(DateTime.DATETIME_MED)}, reminder ${reminderWithThreshold.toLocaleString(DateTime.DATETIME_MED)}, deadline: ${deadlineWithThreshold.toLocaleString(DateTime.DATETIME_MED)})`
      );
    }
  }
}

function sortAndReturn(array: any[], direction: "asc" | "desc") {
  return array.sort((a, b) => {
    if (direction === "asc") {
      return DateTime.fromISO(a.created_at).toMillis() - DateTime.fromISO(b.created_at).toMillis();
    } else {
      return DateTime.fromISO(b.created_at).toMillis() - DateTime.fromISO(a.created_at).toMillis();
    }
  });
}

async function unassignUserFromIssue(context: Context, issue: ListIssueForRepo) {
  const {
    logger,
    config,
  } = context;

  if (config.disqualification <= 0) {
    logger.info("The unassign threshold is <= 0, won't unassign users.");
  } else {
    logger.info(`Passed the deadline on ${issue.url} and no activity is detected, removing assignees.`);
    if (await removeAllAssignees(context, issue)) {
    }
  }
}

async function remindAssigneesForIssue(context: Context, issue: ListIssueForRepo) {
  const {
    logger,
    config,
  } = context;
  if (config.warning <= 0) {
    logger.info("The reminder threshold is <= 0, won't send any reminder.");
  } else {
    await remindAssignees(context, issue)
  }
}

/**
 * Retrieves all the activity for users that are assigned to the issue. Also takes into account linked pull requests.
 */
async function getAssigneesActivityForIssue(context: Context, issue: ListIssueForRepo) {
  const gitHubUrl = parseGitHubUrl(issue.url);
  const issueEvents = await context.octokit.paginate(context.octokit.rest.issues.listEvents, {
    owner: gitHubUrl.owner,
    repo: gitHubUrl.repo,
    issue_number: gitHubUrl.issue_number,
    per_page: 100,
  });
  const linkedPullRequests = await collectLinkedPullRequests(context, gitHubUrl);
  for (const linkedPullRequest of linkedPullRequests) {
    const { owner, repo, issue_number } = parseGitHubUrl(linkedPullRequest.source.issue.html_url);
    const events = await context.octokit.paginate(context.octokit.rest.issues.listEvents, {
      owner,
      repo,
      issue_number,
      per_page: 100,
    });
    issueEvents.push(...events);
  }
  return issueEvents;
}

async function remindAssignees(context: Context, issue: ListIssueForRepo) {
  const { octokit, logger } = context;
  const { repo, owner, issue_number } = parseGitHubUrl(issue.url);

  if (!issue?.assignees?.length) {
    logger.error(`Missing Assignees from ${issue.url}`);
    return false;
  }
  const logins = issue.assignees
    .map((o) => o?.login)
    .filter((o) => !!o)
    .join(", @");
  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number,
    body: `@${logins}, this task has been idle for a while. Please provide an update.`,
  });
  return true;
}

async function removeAllAssignees(context: Context, issue: ListIssueForRepo) {
  const { octokit, logger } = context;
  const { repo, owner, issue_number } = parseGitHubUrl(issue.url);

  if (!issue?.assignees?.length) {
    logger.error(`Missing Assignees from ${issue.url}`);
    return false;
  }
  const logins = issue.assignees.map((o) => o?.login).filter((o) => !!o) as string[];
  await octokit.rest.issues.removeAssignees({
    owner,
    repo,
    issue_number,
    assignees: logins,
  });
  return true;
}
