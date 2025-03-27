#!/bin/bash

# ข้อความ commit อัตโนมัติ
COMMIT_MESSAGE="🟢 Auto-commit: $(date)"

# เพิ่มไฟล์ทั้งหมด
git add .

# Commit พร้อมข้อความเวลา
git commit -m "$COMMIT_MESSAGE"

# Push ขึ้น GitHub
git push origin main
