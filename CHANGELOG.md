# Changelog

## [1.1.0](https://github.com/ishowvel/daemon-disqualifier/compare/v1.0.0...v1.1.0) (2024-10-28)


### Features

* add a config prop 'aggressiveFollowUps' to follow up based on priority level ([ec5aa2b](https://github.com/ishowvel/daemon-disqualifier/commit/ec5aa2bb40232e8273e5560b59612ac819467222))
* added testing ([c834de9](https://github.com/ishowvel/daemon-disqualifier/commit/c834de9edefce23c11dc4d91ecc48d7e16ed3e5f))
* changed the time parsing to be with ms package ([99fa8f7](https://github.com/ishowvel/daemon-disqualifier/commit/99fa8f74524552b8dd17ae0dd6a66da3782abab3))
* database generation script ([6f19d4d](https://github.com/ishowvel/daemon-disqualifier/commit/6f19d4d0722dbcfd4e3b59ce1dddb94a550a20ac))
* database generation script ([fb4be18](https://github.com/ishowvel/daemon-disqualifier/commit/fb4be189de5c07794d05099acc9b61991f9813bf))
* linked pull request activity is now taken into account ([790d1c1](https://github.com/ishowvel/daemon-disqualifier/commit/790d1c12e3b1d716e72756e486723c3fe018d252))
* schema validation ([c9cbdcd](https://github.com/ishowvel/daemon-disqualifier/commit/c9cbdcd41ef6122851925e13d78932aa6a7a16a5))
* tests ([4f3a726](https://github.com/ishowvel/daemon-disqualifier/commit/4f3a7260a12bf59b712e223abf8495be43c2b080))
* threshold can be expressed as human-readable strings ([df167d0](https://github.com/ishowvel/daemon-disqualifier/commit/df167d0b29335c1143ff6e1e6c2f11f0529e59c5))
* ubiquibot-logger ([1eac2e5](https://github.com/ishowvel/daemon-disqualifier/commit/1eac2e585108e27cc14652d7df6101c52b1619e9))
* user get reminded and unassigned ([797cd6e](https://github.com/ishowvel/daemon-disqualifier/commit/797cd6e27788e119de27722118fbcf766ce4e79a))


### Bug Fixes

* cast created_at as date first ([b8597db](https://github.com/ishowvel/daemon-disqualifier/commit/b8597db5021696a85e88064c2bec210f5af92c41))
* changed logic to compute deadline ([7fef8f5](https://github.com/ishowvel/daemon-disqualifier/commit/7fef8f51b4649622b8b634460ce9d94e0556e04f))
* correct environment variable names in GitHub workflow ([5957b73](https://github.com/ishowvel/daemon-disqualifier/commit/5957b73fbe3cb6108a99717871e3b12778dc5b9e))
* correct environment variables names in workflow file ([6649005](https://github.com/ishowvel/daemon-disqualifier/commit/6649005b340eca775fe8e17cea4c46d83f9c85c6))
* deadline parsing ([23c2f38](https://github.com/ishowvel/daemon-disqualifier/commit/23c2f38d4f56267beb718d0d593d46e54b3084c7))
* enable unassigning and reminding users for overdue tasks ([92de0ec](https://github.com/ishowvel/daemon-disqualifier/commit/92de0ecc37c5dd37bde5218392c473558a755b77))
* moved get env outside of main file ([cb55e61](https://github.com/ishowvel/daemon-disqualifier/commit/cb55e610d5ec2d7dd936f97155f2cc1814c1302d))
* new date casting ([bed3f95](https://github.com/ishowvel/daemon-disqualifier/commit/bed3f955f425d053bf21efd7cde1fec41c3f88a9))
* swap function parameters in validateAndDecodeSchemas ([090224c](https://github.com/ishowvel/daemon-disqualifier/commit/090224ce60d5cd273663deea4ba784530faa0d2f))
* **typos:** correct typo in task-deadline comment ([ca77a37](https://github.com/ishowvel/daemon-disqualifier/commit/ca77a37f36d206a27b1c4f4fb671b75587a9d921))
* updated Jest test comment ([d6d5e28](https://github.com/ishowvel/daemon-disqualifier/commit/d6d5e2881a106568f1b2eb6ba9710041dba75950))
* use task assignment event fallback for lastCheck ([ca1bc9f](https://github.com/ishowvel/daemon-disqualifier/commit/ca1bc9f9191b3c8550e05ef06808b9f2f13fb732))

## 1.0.0 (2024-07-09)

### Features

- added testing ([c834de9](https://github.com/ubiquibot/user-activity-watcher/commit/c834de9edefce23c11dc4d91ecc48d7e16ed3e5f))
- changed the time parsing to be with ms package ([99fa8f7](https://github.com/ubiquibot/user-activity-watcher/commit/99fa8f74524552b8dd17ae0dd6a66da3782abab3))
- database generation script ([6f19d4d](https://github.com/ubiquibot/user-activity-watcher/commit/6f19d4d0722dbcfd4e3b59ce1dddb94a550a20ac))
- database generation script ([fb4be18](https://github.com/ubiquibot/user-activity-watcher/commit/fb4be189de5c07794d05099acc9b61991f9813bf))
- linked pull request activity is now taken into account ([790d1c1](https://github.com/ubiquibot/user-activity-watcher/commit/790d1c12e3b1d716e72756e486723c3fe018d252))
- threshold can be expressed as human-readable strings ([df167d0](https://github.com/ubiquibot/user-activity-watcher/commit/df167d0b29335c1143ff6e1e6c2f11f0529e59c5))
- user get reminded and unassigned ([797cd6e](https://github.com/ubiquibot/user-activity-watcher/commit/797cd6e27788e119de27722118fbcf766ce4e79a))

### Bug Fixes

- moved get env outside of main file ([cb55e61](https://github.com/ubiquibot/user-activity-watcher/commit/cb55e610d5ec2d7dd936f97155f2cc1814c1302d))
- updated Jest test comment ([d6d5e28](https://github.com/ubiquibot/user-activity-watcher/commit/d6d5e2881a106568f1b2eb6ba9710041dba75950))
