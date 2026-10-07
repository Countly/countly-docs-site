// Prints the pull request that brought a commit into main (or into another branch or release
// tag), so drift PRs can cite where an endpoint was added or removed.
//
//   node scripts/find-merge-pr.mjs <commit> [path-to-repo] [branch-or-tag]
//
// Defaults: ./countly-platform and main. For an older version, pass the countly-server or
// countly-enterprise-plugins checkout and its release tag, e.g. 25.03.54.
//
// Walks the branch's first-parent history from the commit's date and takes the first commit that
// contains it: a "Merge pull request #N" commit, or a squash merge titled "... (#N)".
import {execFileSync} from "node:child_process";
import path from "node:path";

const [sha, platformArg = "countly-platform", refArg = "main"] = process.argv.slice(2);
if (!sha) {
  console.error("Usage: node scripts/find-merge-pr.mjs <commit> [path-to-repo] [branch-or-tag]");
  process.exit(2);
}
const PLATFORM = path.resolve(platformArg);
const git = (...args) => execFileSync("git", ["-C", PLATFORM, ...args], {encoding: "utf8"}).trim();
const succeeds = (...args) => {
  try {
    execFileSync("git", ["-C", PLATFORM, ...args], {stdio: "ignore"});
    return true;
  }
  catch {
    return false;
  }
};

// https://github.com/Countly/<repo>, from the checkout's origin (https or ssh form).
const origin = succeeds("remote", "get-url", "origin") ? git("remote", "get-url", "origin") : "";
const REPO_URL = `https://github.com/${origin.match(/github\.com[:/](.+?)(\.git)?$/)?.[1] || "Countly/countly-platform"}`;
const main = succeeds("rev-parse", "--verify", `origin/${refArg}^{commit}`) ? `origin/${refArg}` : refArg;
if (!succeeds("rev-parse", "--verify", `${sha}^{commit}`)) {
  console.log(`Pull request: none found. ${sha} is not a commit in ${PLATFORM}.`);
  process.exit(1);
}
const commit = git("rev-parse", "--verify", `${sha}^{commit}`);
const [commitDate, commitSubject, commitAuthor] = git("log", "-1", "--format=%cI%x09%s%x09%an", commit).split("\t");
console.log(`Commit: ${REPO_URL}/commit/${commit.slice(0, 10)} (${commitDate.slice(0, 10)}, ${commitAuthor}): ${commitSubject}`);

for (const candidate of git("rev-list", "--first-parent", "--reverse", `--since=${commitDate}`, main).split("\n").filter(Boolean)) {
  if (!succeeds("merge-base", "--is-ancestor", commit, candidate)) {
    continue;
  }
  const [date, subject] = git("log", "-1", "--format=%cI%x09%s", candidate).split("\t");
  const number = subject.match(/^Merge pull request #(\d+)/)?.[1] || subject.match(/\(#(\d+)\)\s*$/)?.[1];
  console.log(number
    ? `Pull request: ${REPO_URL}/pull/${number} (merged ${date.slice(0, 10)})`
    : `Pull request: none found. It reached ${refArg} directly in ${REPO_URL}/commit/${candidate.slice(0, 10)} (${date.slice(0, 10)}).`);
  process.exit(0);
}
console.log(`Pull request: none found. The commit is not on ${refArg}.`);
