# nvm-list-with-notes.ps1
# Description: Display NVM installed Node versions with custom notes

# Configuration file path
$notesFilePath = "$env:USERPROFILE\.nvm_version_notes.json"

# Ensure configuration file exists
if (-not (Test-Path $notesFilePath)) {
    @{} | ConvertTo-Json | Out-File $notesFilePath
}

# Read notes configuration - PowerShell 5 compatible way
$jsonContent = Get-Content -Raw -Path $notesFilePath
$versionNotes = @{}

# Parse JSON manually for PowerShell 5 compatibility
try {
    $jsonObject = ConvertFrom-Json -InputObject $jsonContent
    if ($jsonObject -ne $null) {
        $jsonObject.psobject.properties | ForEach-Object {
            $versionNotes[$_.Name] = $_.Value
        }
    }
} catch {
    Write-Host "Warning: Failed to parse notes file: $_"
}

# Parse command arguments
$argsStr = $args -join ' '

# Check if it's a command to add/update notes
if ($argsStr -match '^note\s+([\d\.]+)\s+(.+)$') {
    $version = $Matches[1]
    $note = $Matches[2]
    
    # Update notes
    $versionNotes[$version] = $note
    
    # Save to configuration file
    $versionNotes | ConvertTo-Json | Out-File $notesFilePath
    
    Write-Host "Added/updated note for Node ${version}: $note"
    exit
}

# Check if it's a command to remove notes
if ($argsStr -match '^note\s+remove\s+([\d\.]+)$') {
    $version = $Matches[1]
    
    if ($versionNotes.ContainsKey($version)) {
        $versionNotes.Remove($version)
        
        # Save to configuration file
        $versionNotes | ConvertTo-Json | Out-File $notesFilePath
        
        Write-Host "Removed note for Node $version"
    } else {
        Write-Host "No note found for Node $version"
    }
    exit
}

# Execute nvm list command and capture output
try {
    $nvmOutput = nvm list
} catch {
    Write-Host "Error executing nvm command: $_"
    exit 1
}

# Display original output
Write-Host $nvmOutput

# Display separator
Write-Host "`n===== Version Notes ====="

# Extract version numbers and display notes
$lines = $nvmOutput -split "`n"
foreach ($line in $lines) {
    # Match version number format, e.g. v18.16.0 or 18.16.0
    if ($line -match '(?:v)?([\d\.]+)') {
        $version = $Matches[1]
        if ($versionNotes.ContainsKey($version)) {
            Write-Host "${version}: $($versionNotes[$version])"
        }
    }
}

# If there are no notes or no notes were displayed
if ($versionNotes.Count -eq 0) {
    Write-Host "No version notes available, use 'nvm-list-with-notes.ps1 note version notes' to add notes"
} else {
    # Check if any notes were actually displayed
    $anyNoteDisplayed = $false
    foreach ($line in $lines) {
        if ($line -match '(?:v)?([\d\.]+)') {
            $version = $Matches[1]
            if ($versionNotes.ContainsKey($version)) {
                $anyNoteDisplayed = $true
                break
            }
        }
    }
    
    if (-not $anyNoteDisplayed) {
        Write-Host "No notes match the installed versions. Available notes:"
        foreach ($key in $versionNotes.Keys) {
            Write-Host "  - ${key}: $($versionNotes[$key])"
        }
    }
}

Write-Host "`nUsage:"
Write-Host "1. Add/update note: nvm-list-with-notes.ps1 note version notes"
Write-Host "2. Remove note: nvm-list-with-notes.ps1 note remove version"
Write-Host "3. Run directly to show list: nvm-list-with-notes.ps1"