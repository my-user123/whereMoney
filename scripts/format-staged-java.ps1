$ErrorActionPreference = "Stop"

$formatterJar = "D:\google-java-format\google-java-format-1.15.0-all-deps.jar"

function Exit-Block($message) {
  Write-Error $message
  exit 2
}

if (-not (Test-Path -LiteralPath $formatterJar)) {
  Exit-Block "format-staged-java: google-java-format jar not found at $formatterJar."
}

if (-not (Test-Path -LiteralPath ".git")) {
  Write-Output "format-staged-java: not a Git repository; skipped."
  exit 0
}

& git rev-parse --is-inside-work-tree > $null 2> $null
if ($LASTEXITCODE -ne 0) {
  Write-Output "format-staged-java: not inside a Git work tree; skipped."
  exit 0
}

$files = @(git diff --cached --name-only --diff-filter=ACMR -- "*.java")
if ($LASTEXITCODE -ne 0) {
  Exit-Block "format-staged-java: failed to inspect staged Java files."
}

if ($files.Count -eq 0) {
  Write-Output "format-staged-java: no staged Java files."
  exit 0
}

foreach ($file in $files) {
  if (Test-Path -LiteralPath $file) {
    & java -jar $formatterJar -i $file
    if ($LASTEXITCODE -ne 0) {
      Exit-Block "format-staged-java: google-java-format failed for $file."
    }
  }
}

$changedAfterFormat = @(git diff --name-only -- $files)
if ($LASTEXITCODE -ne 0) {
  Exit-Block "format-staged-java: failed to inspect formatting changes."
}

if ($changedAfterFormat.Count -gt 0) {
  $fileList = $changedAfterFormat -join ", "
  Exit-Block "format-staged-java: formatted staged Java files changed working tree files: $fileList. Run git add for these files, then inspect git diff --cached before committing."
}

Write-Output "format-staged-java: staged Java files already formatted."
exit 0
