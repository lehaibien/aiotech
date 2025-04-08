#!/bin/bash

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if SQL files exist
if [ -z "$(ls *.sql 2>/dev/null)" ]; then
    echo "No SQL files found in the current directory."
    exit 1
fi

# Run init.sql first
echo "Running init.sql..."
docker run --rm --network aiotech_prod_backend -v $(pwd):/scripts -w /scripts mcr.microsoft.com/mssql-tools /opt/mssql-tools/bin/sqlcmd -S aiotech_db -U SA -P "S3cr3tP@ssw0rd" -d "AioTech" -i "init.sql"

# Run remaining SQL files
for file in *.sql; do
    if [ "$file" != "init.sql" ]; then
        echo "Running $file..."
        docker run --rm --network aiotech_prod_backend -v $(pwd):/scripts -w /scripts mcr.microsoft.com/mssql-tools /opt/mssql-tools/bin/sqlcmd -S aiotech_db -U SA -P "S3cr3tP@ssw0rd" -d "AioTech" -i "$file"
    fi
done

echo "All SQL scripts have been executed."