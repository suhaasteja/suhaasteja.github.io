import csv

data = []
police = 0

with open('full_data_2014.csv', 'r') as csvfile:
	reader = csv.reader(csvfile, delimiter=',')
	next(reader, None)
	for row in reader:
		if row[4] != 'NA':
			age = int(row[4])
			if age < 16:
				agegroup = "15"
			if age >= 16 and age < 35:
				agegroup = "15to34"
			if age >= 35 and age < 64:
				agegroup = "35to64"
			if age >= 65:
				agegroup = "65older"
			if int(row[2]) == 1:
				police += 1
		row[4] = agegroup
		data.append(row)

sorted_data = sorted(data, key= lambda x: (x[1], x[2], x[3], x[4]))

#sorted_intent_race = sorted(data, key= lambda x: (x[2], x[6], x[4]))

'''
intent = []
sex = []
race = []
for i in data:
	if i[2] not in intent:
		intent.append(i[2])
	if i[4] not in sex:
		sex.append(i[4])
	if i[6] not in race:
		race.append(i[6])
'''

header = ["year","intent","police","sex","age","race"]

with open('all_deaths_2014.csv', 'w') as csvfile:
	writer = csv.writer(csvfile, delimiter=',')
	writer.writerow(header)
	writer.writerows(sorted_data)


