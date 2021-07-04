require('dotenv').config();

const { BlobServiceClient, AnonymousCredential } = require('@azure/storage-blob');
const { mkdir } = require('fs/promises');
const { createReadStream, unlinkSync, readdirSync, rmdirSync } = require('fs');
const { createGunzip } = require('zlib');
const split = require('split2');
const { promisify } = require('util');
const { basename, extname } = require('path');
const glob = require('glob');

const globSync = promisify(glob);

const archivesFolder = 'archives';

// Pad hour to two characters to lexicographical order of the blobs is also time order
function getBlobName(timestamp) {
    const archiveDate = new Date(timestamp);
    const year = archiveDate.getUTCFullYear();
    const month = (archiveDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = archiveDate.getUTCDate().toString().padStart(2, '0');
    const hour = archiveDate.getUTCHours().toString().padStart(2, '0');
    return `${year}/${month}/${day}/${year}-${month}-${day}-${hour}.json.gz`;
}

function getContainerClient() {
    const account = process.env.OBSCENE_COMMITS_ACCOUNT_NAME || '';
    const container = process.env.ARCHIVE_CONTAINER_NAME || '';
    const anonymousCredential = new AnonymousCredential();

    const blobClient = new BlobServiceClient(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`,
        anonymousCredential,
    );

    return blobClient.getContainerClient(container);
}

async function makeArchiveFolder() {
    return await mkdir(archivesFolder, { recursive: true });
}

async function getDownloadedFiles() {
    return await globSync(`${archivesFolder}/**/*.json.gz`);
}

async function downloadArchives() {
    const downloadedArchives = await getDownloadedFiles();
    const containerClient = getContainerClient();

    let end_timestamp = new Date(new Date().toUTCString());
    end_timestamp.setMinutes(0);
    end_timestamp.setSeconds(0);
    end_timestamp.setMilliseconds(0);
    let begin_timestamp = new Date(end_timestamp.toUTCString());
    begin_timestamp.setDate(end_timestamp.getDate() - 3);

    // Cleanup old archives
    downloadedArchives.forEach((downloadedArchive) => {
        const dateParts = basename(downloadedArchive, '.json.gz').split('-');
        let downloadArchiveDate = new Date();
        downloadArchiveDate.setUTCFullYear(dateParts[0]);
        downloadArchiveDate.setUTCMonth(dateParts[1] - 1);
        downloadArchiveDate.setUTCDate(dateParts[2]);
        downloadArchiveDate.setUTCHours(dateParts[3]);
        downloadArchiveDate.setUTCMinutes(0);
        downloadArchiveDate.setUTCSeconds(0);
        downloadArchiveDate.setUTCMilliseconds(0);
        if (downloadArchiveDate < begin_timestamp || downloadArchiveDate >= end_timestamp) {
            console.log(`Deleting ${downloadedArchive}`);
            unlinkSync(downloadedArchive);
        }
    });

    // Delete any empty folders
    const directories = (await globSync(`${archivesFolder}/**/*`)).filter((value) => {
        return !downloadedArchives.includes(value);
    });
    directories.forEach((directory) => {
        if (readdirSync(directory).length === 0) {
            console.log(`Deleting ${directory}`);
            rmdirSync(directory);
        }
    });

    // Download new archives
    for (
        const curr_timestamp = begin_timestamp;
        begin_timestamp < end_timestamp;
        curr_timestamp.setUTCHours(curr_timestamp.getUTCHours() + 1)
    ) {
        const blob = getBlobName(curr_timestamp);
        const downloadPath = `${archivesFolder}/${blob}`;
        if (!downloadedArchives.includes(downloadPath)) {
            console.log(`Downloading ${blob}`);
            await mkdir(downloadPath.substr(0, downloadPath.lastIndexOf('/')), {
                recursive: true,
            });
            try {
                await containerClient.getBlockBlobClient(blob).downloadToFile(downloadPath);
            } catch (e) {
                console.log(`Unable to download ${blob}`);
            }
        }
    }
}

module.exports = async function () {
    console.log('Creating commit list');
    await makeArchiveFolder();
    await downloadArchives();

    let commits = [];
    for (const archive of await getDownloadedFiles()) {
        await new Promise((resolve) => {
            createReadStream(archive)
                .pipe(createGunzip())
                .pipe(split())
                .on('data', (buffer) => {
                    const eventObj = JSON.parse(buffer);
                    let fullRepoName = eventObj['repo']['name'];
                    let branchName = eventObj['payload']['ref'].startsWith('refs/heads/')
                        ? eventObj['payload']['ref'].substring(eventObj['payload']['ref'].indexOf('/', 5) + 1)
                        : '';
                    const commit = {
                        authorName: eventObj['actor']['display_login'],
                        authorUrl: `https://github.com/${eventObj['actor']['display_login']}`,
                        authorAvatarUrl: `${eventObj['actor']['avatar_url']}s=144`,
                        repoOwner: fullRepoName.split('/')[0],
                        repoName: fullRepoName.split('/')[1],
                        repoUrl: `https://github.com/${fullRepoName}`,
                        branchName: branchName,
                        branchUrl: `https://github.com/${fullRepoName}/tree/${branchName}`,
                        commitTime: eventObj['created_at'],
                    };
                    eventObj['payload']['commits'].forEach((eventCommit) => {
                        commits.push({
                            ...commit,
                            message: eventCommit['message'],
                            commitUrl: `https://github.com/${fullRepoName}/commit/${eventCommit['sha']}`,
                        });
                    });
                })
                .on('end', () => {
                    resolve();
                });
        });
    }

    return commits;
};
