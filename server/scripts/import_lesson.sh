for i in $(ls | grep '.*\.json');
do
echo $i
curl -X POST -H "Content-Type: application/json" -d @./$i http://localhost:3000/lectures/import_lesson
done
