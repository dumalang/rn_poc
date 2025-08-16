adb shell
# Inside shell:
run-as com.rn_poc
cd databases
ls
# Ensure AppDatabase.db exists
exit
# Now, back in your terminal:
adb exec-out run-as com.rn_poc cat databases/AppDatabase.db > ~/Desktop/AppDatabase.db
