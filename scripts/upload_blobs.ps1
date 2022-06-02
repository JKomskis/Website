# Usage: upload_blobs.ps1 <Resource Group Name> <Storage Account Name>
$rgName = $args[0]
$acctName = $args[1]
$localFolder = "_site"

Set-AzCurrentStorageAccount -ResourceGroupName $rgName -Name $acctName

function Get-LocalBlobs {

    # $blobs = @()
    Push-Location $localFolder
    $blobs = (Get-ChildItem -Recurse -File).FullName | Resolve-Path -Relative | ForEach-Object -Parallel {
        $blob = "" | Select-Object Name, Hash
        $blob.Name = $_.substring(2) # Remove leading ./
        $blob.Hash = (Get-FileHash $_ -Algorithm MD5).Hash

        # $blobs += $blob
        return $blob
    } -ThrottleLimit 50
    Pop-Location
    return $blobs
}

function Get-RemoteBlobs {
    return Get-AzStorageBlob -Container '$web' -ConcurrentTaskCount 50 | ForEach-Object -Parallel {
        $blob = "" | Select-Object Name, Hash
        $blob.Name = $_.Name
        $blob.Hash = -join $_.BlobProperties.ContentHash.ForEach('ToString', 'X2')

        return $blob
    }
}

function Set-Blobs {
    param(
        [Parameter()]
        [Object[]] $files
    )

    $staticAssetCacheControl = "public, max-age=31536000, immutable"
    $revalidateAssetCacheControl = "no-cache"
    $properties = @{
        ".css"   = @{
            CacheControl = $staticAssetCacheControl
            ContentType  = "text/css"
        }
        ".js"    = @{
            CacheControl = $staticAssetCacheControl
            ContentType  = "application/javascript"
        }
        ".woff2" = @{
            CacheControl = $staticAssetCacheControl
            ContentType  = "font/woff2"
        }
        ".jpg"   = @{
            CacheControl = $staticAssetCacheControl
            ContentType  = "image/jpeg"
        }
        ".png"   = @{
            CacheControl = $staticAssetCacheControl
            ContentType  = "image/png"
        }
        ".svg"   = @{
            CacheControl = $staticAssetCacheControl
            ContentType  = "image/svg+xml"
        }
        ".html"  = @{
            CacheControl = $revalidateAssetCacheControl
            ContentType  = "text/html"
        }
    }

    Push-Location $localFolder
    $files | Foreach-Object -Parallel {
        $properties_dict = $using:properties
        Write-Output "Uploading file $_"
        $path = Get-Item $_
        $fileProperties = $properties_dict[$path.extension]
        if ($fileProperties) {
            Set-AzStorageBlobContent -File $path.FullName -Blob $_ -Container '$web' -properties $fileProperties -Force
        }
        else {
            Set-AzStorageBlobContent -File $path.FullName -Blob $_ -Container '$web' -Force
        }
    } -ThrottleLimit 50
    Pop-Location
}

function Remove-Blobs {
    param(
        [Parameter()]
        [Object[]] $files
    )

    $files | ForEach-Object -Parallel {
        Write-Output "Removing file $_"
        Get-AzStorageBlob -Container '$web' -Blob $_ | Remove-AzStorageBlob
    } -ThrottleLimit 50

}

$localFiles = Get-LocalBlobs
$remoteFiles = Get-RemoteBlobs

$differences = Compare-Object @($localFiles | Select-Object) @($remoteFiles | Select-Object) -Property Name, Hash

$missingRemoteFiles = ($differences | Where-Object { $_.SideIndicator -eq "<=" }).Name
$extraRemoteFiles = ($differences | Where-Object { $_.SideIndicator -eq "=>" }).Name

$extraRemoteFiles = $extraRemoteFiles | Where-Object { $_ -notin $missingRemoteFiles }

if ( $missingRemoteFiles ) {
    Set-Blobs $missingRemoteFiles
}
else {
    Write-Output "No blobs to upload"
}
if ( $extraRemoteFiles ) {
    Remove-Blobs $extraRemoteFiles
}
else {
    Write-Output "No blobs to remove"
}
