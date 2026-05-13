param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $Path
)

$ErrorActionPreference = "Stop"

$formatterJar = "D:\google-java-format\google-java-format-1.15.0-all-deps.jar"

function Exit-Block($message) {
  Write-Error $message
  exit 2
}

if (-not (Test-Path -LiteralPath $formatterJar)) {
  Exit-Block "format-java: google-java-format jar not found at $formatterJar."
}

if ($null -eq $Path -or $Path.Count -eq 0) {
  Write-Output "format-java: no paths provided."
  exit 0
}

$javaFiles = New-Object System.Collections.Generic.List[string]

foreach ($item in $Path) {
  if ([string]::IsNullOrWhiteSpace($item)) {
    continue
  }

  if (-not (Test-Path -LiteralPath $item)) {
    Exit-Block "format-java: path not found: $item"
  }

  $resolved = Resolve-Path -LiteralPath $item
  foreach ($entry in $resolved) {
    $target = Get-Item -LiteralPath $entry.Path
    if ($target.PSIsContainer) {
      Get-ChildItem -LiteralPath $target.FullName -Recurse -Filter "*.java" -File |
        ForEach-Object { $javaFiles.Add($_.FullName) }
    } elseif ($target.Extension -eq ".java") {
      $javaFiles.Add($target.FullName)
    }
  }
}

if ($javaFiles.Count -eq 0) {
  Write-Output "format-java: no Java files found."
  exit 0
}

& java -jar $formatterJar -i @javaFiles
if ($LASTEXITCODE -ne 0) {
  Exit-Block "format-java: google-java-format failed."
}

Write-Output "format-java: formatted $($javaFiles.Count) Java file(s)."
exit 0
