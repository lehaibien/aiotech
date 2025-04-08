for %%f in (*.sql) do (
    docker run --rm --network aiotech_api_only_dev_backend -v %cd%:/scripts -w /scripts mcr.microsoft.com/mssql-tools /opt/mssql-tools/bin/sqlcmd -S aiotech_db_only -U SA -P "S3cr3tP@ssw0rd" -d "AioTech" -i "%%f"
)

pause