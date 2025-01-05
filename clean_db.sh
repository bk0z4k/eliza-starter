#!/bin/bash

echo "Cleaning eliza_db database..."
sudo -u postgres psql eliza_db -c "TRUNCATE TABLE memories, participants, accounts, rooms RESTART IDENTITY CASCADE;"
echo "Database cleaned successfully!" 