#!/bin/bash

DB_PATH="/data/db.sqlite"
BACKUP_DIR="/data/backups"
DATE=$(date +%F)
BACKUP_FILE="$BACKUP_DIR/db_$DATE.sqlite"
BACKUP_FILE_GZ="$BACKUP_FILE.gz"
REMOTE="gdrive:/"

mkdir -p $BACKUP_DIR

sqlite3 $DB_PATH ".backup '$BACKUP_FILE'"

if sqlite3 $BACKUP_FILE "PRAGMA integrity_check;" | grep -q "ok"; then
    echo "$(date) - Backup integrity OK"
else
    echo "$(date) - Backup integrity FAILED" >&2
    exit 1
fi

gzip -f $BACKUP_FILE

rclone copy $BACKUP_FILE_GZ $REMOTE

find $BACKUP_DIR -type f -mtime +30 -delete
