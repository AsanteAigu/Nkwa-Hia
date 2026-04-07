import bcrypt from 'bcryptjs';

export const mockDB = {
  hospitals: [
  {
    "id": "greater-accra-regional-hospital",
    "name": "Greater Accra Regional Hospital",
    "type": "Regional",
    "departments": [
      "Emergency",
      "ICU",
      "Maternity",
      "Surgical"
    ],
    "hospital_key": "HGK-GARH-EEHSNS"
  },
  {
    "id": "claron-health-international",
    "name": "Claron Health International",
    "type": "District",
    "departments": [
      "Emergency",
      "General"
    ],
    "hospital_key": "HGK-CHI-DBZUQN"
  },
  {
    "id": "university-of-ghana-medical-centre",
    "name": "University Of Ghana Medical Centre",
    "type": "Teaching",
    "departments": [
      "Emergency",
      "ICU",
      "General",
      "Maternity",
      "Paediatric",
      "Theatre",
      "Surgical"
    ],
    "hospital_key": "HGK-UOGM-FNE7MZ"
  },
  {
    "id": "37-military-hospital",
    "name": "37 Military Hospital",
    "type": "Regional",
    "departments": [
      "ICU",
      "Emergency",
      "Surgical",
      "Maternity",
      "General"
    ],
    "hospital_key": "HGK-3MH-GZDFKD"
  },
  {
    "id": "nyaho-medical-centre",
    "name": "Nyaho Medical Centre",
    "type": "District",
    "departments": [
      "Emergency",
      "General"
    ],
    "hospital_key": "HGK-NMC-0XG1TM"
  },
  {
    "id": "the-bank-hospital",
    "name": "The Bank Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "General",
      "ICU"
    ],
    "hospital_key": "HGK-TBH-D8VN4P"
  },
  {
    "id": "midway-hospital",
    "name": "Midway Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-MH-WUPOAT"
  },
  {
    "id": "lifeview-medical-hospital",
    "name": "LifeView Medical Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-LMH-HTTOQE"
  },
  {
    "id": "achimota-hospital",
    "name": "Achimota Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "General",
      "Maternity"
    ],
    "hospital_key": "HGK-AH-YXNTJO"
  },
  {
    "id": "st-michaels-specialist-hospital",
    "name": "St Michael's Specialist Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "Theatre"
    ],
    "hospital_key": "HGK-SMSH-A7AI7U"
  },
  {
    "id": "ga-east-municipal-hospital",
    "name": "GA EAST MUNICIPAL HOSPITAL",
    "type": "District",
    "departments": [
      "Emergency",
      "General"
    ],
    "hospital_key": "HGK-GEMH-DEO9BD"
  },
  {
    "id": "healthnet-airport-medical-centre",
    "name": "Healthnet Airport Medical Centre",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-HAMC-GN0UXP"
  },
  {
    "id": "maamobi-general-hospital",
    "name": "Maamobi General Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "General",
      "Maternity"
    ],
    "hospital_key": "HGK-MGH-6FKOSA"
  },
  {
    "id": "aims-hospital",
    "name": "AIMS Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-AH-XIYCWF"
  },
  {
    "id": "rayan-medical-centre",
    "name": "Rayan Medical Centre",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-RMC-VECFED"
  },
  {
    "id": "accra-medical-centre",
    "name": "Accra Medical Centre",
    "type": "District",
    "departments": [
      "Emergency",
      "General"
    ],
    "hospital_key": "HGK-AMC-8J5YF5"
  },
  {
    "id": "st-kathryns-hospital",
    "name": "St. Kathryn's Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-SKH-O3HXP4"
  },
  {
    "id": "valley-view-medical-center",
    "name": "Valley View Medical Center",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-VVMC-ND9EEA"
  },
  {
    "id": "crown-medical-centre-accra-ghana",
    "name": "Crown Medical Centre, Accra - Ghana",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-CMCA-BZBP5K"
  },
  {
    "id": "airport-womens-hospital",
    "name": "Airport Women's Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "Maternity",
      "Paediatric"
    ],
    "hospital_key": "HGK-AWH-ZSSQIK"
  },
  {
    "id": "north-legon-hospital",
    "name": "North Legon Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "Maternity",
      "Paediatric"
    ],
    "hospital_key": "HGK-NLH-VXRY8V"
  },
  {
    "id": "police-hospital",
    "name": "Police Hospital",
    "type": "Regional",
    "departments": [
      "Emergency",
      "General",
      "Theatre"
    ],
    "hospital_key": "HGK-PH-HAVDZI"
  },
  {
    "id": "the-trust-hospital-osu",
    "name": "The Trust Hospital, Osu",
    "type": "District",
    "departments": [
      "Emergency",
      "Surgical",
      "ICU"
    ],
    "hospital_key": "HGK-TTHO-DHHJ2K"
  },
  {
    "id": "holy-trinity-medical-centre",
    "name": "Holy Trinity Medical Centre",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-HTMC-L9D9OQ"
  },
  {
    "id": "korle-bu-teaching-hospital",
    "name": "Korle Bu Teaching Hospital",
    "type": "Teaching",
    "departments": [
      "ICU",
      "Emergency",
      "Maternity",
      "Surgical",
      "Oncology",
      "Paediatric",
      "Theatre",
      "Laboratory"
    ],
    "hospital_key": "HGK-KBTH-V1Q5GO"
  },
  {
    "id": "university-hospital-legon",
    "name": "University Hospital - Legon",
    "type": "District",
    "departments": [
      "Emergency",
      "Maternity",
      "Paediatric"
    ],
    "hospital_key": "HGK-UH-L-ADHR7J"
  },
  {
    "id": "family-health-hospital",
    "name": "Family Health Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-FHH-YA1EFI"
  },
  {
    "id": "accra-newtown-islamic-hospital",
    "name": "Accra Newtown Islamic Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-ANIH-SWRF05"
  },
  {
    "id": "lapaz-community-hospital-annex-a",
    "name": "Lapaz community hospital Annex A",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-LCHA-YCXSMN"
  },
  {
    "id": "focos-orthopaedic-hospital",
    "name": "FOCOS Orthopaedic Hospital",
    "type": "Regional",
    "departments": [
      "Emergency",
      "Surgical"
    ],
    "hospital_key": "HGK-FOH-WD1N8A"
  },
  {
    "id": "providence-specialists-hospital",
    "name": "Providence Specialists Hospital",
    "type": "District",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-PSH-LMEUVS"
  },
  {
    "id": "a-a-family-hospital",
    "name": "A & A Family Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-A&AF-RONX6F"
  },
  {
    "id": "solis-hospital",
    "name": "Solis Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-SH-WYYTY2"
  },
  {
    "id": "eden-family-hospital",
    "name": "Eden Family Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-EFH-MRKGLV"
  },
  {
    "id": "lapaz-community-hospital",
    "name": "Lapaz Community Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "General"
    ],
    "hospital_key": "HGK-LCH-POZ2VU"
  },
  {
    "id": "franklyn-medical-centre",
    "name": "Franklyn Medical Centre",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-FMC-FASYME"
  },
  {
    "id": "new-ashongman-community-hospital",
    "name": "New Ashongman Community Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-NACH-PKZPLZ"
  },
  {
    "id": "atomic-hospital",
    "name": "Atomic Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-AH-PT2J08"
  },
  {
    "id": "vra-hospital-accra",
    "name": "VRA HOSPITAL, ACCRA",
    "type": "District",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-VHA-LMAHPT"
  },
  {
    "id": "lucy-memorial-hospital",
    "name": "Lucy Memorial hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-LMH-8IRPRL"
  },
  {
    "id": "yeboah-hospital",
    "name": "Yeboah Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-YH-NREBOF"
  },
  {
    "id": "emmanuel-community-hospital",
    "name": "Emmanuel Community Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-ECH-RKQJCN"
  },
  {
    "id": "otobia-memorial-hospital",
    "name": "Otobia Memorial Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-OMH-YCDODI"
  },
  {
    "id": "trust-specialist-hospital-osu",
    "name": "Trust Specialist Hospital, Osu",
    "type": "District",
    "departments": [
      "Emergency",
      "Surgical",
      "ICU"
    ],
    "hospital_key": "HGK-TSHO-UPFB5S"
  },
  {
    "id": "barnor-memorial-hospital",
    "name": "Barnor Memorial Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-BMH-GFJ7YJ"
  },
  {
    "id": "twumasiwaa-hospital",
    "name": "Twumasiwaa Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-TH-UC6IXG"
  },
  {
    "id": "inkoom-hospital",
    "name": "Inkoom Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-IH-LEHK3F"
  },
  {
    "id": "commonwealth-aid-clinic",
    "name": "COMMONWEALTH AID CLINIC",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-CAC-CWI7YV"
  },
  {
    "id": "esidem-hospital",
    "name": "Esidem Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-EH-1A1KMO"
  },
  {
    "id": "ga-north-municipal-hospital",
    "name": "Ga North Municipal Hospital",
    "type": "District",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-GNMH-YEXWS2"
  },
  {
    "id": "lister-hospital-and-fertility-centre",
    "name": "Lister Hospital And Fertility Centre",
    "type": "District",
    "departments": [
      "Emergency",
      "Maternity"
    ],
    "hospital_key": "HGK-LHAF-OL4I0X"
  },
  {
    "id": "ghana-canada-medical-centre",
    "name": "Ghana-Canada Medical Centre",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-GMC-X8ACIB"
  },
  {
    "id": "pentecost-hospital-madina",
    "name": "Pentecost Hospital, Madina",
    "type": "District",
    "departments": [
      "Emergency",
      "General",
      "Maternity"
    ],
    "hospital_key": "HGK-PHM-1IUSJZ"
  },
  {
    "id": "anthon-memorial-hospital",
    "name": "Anthon Memorial Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-AMH-0VL1QD"
  },
  {
    "id": "del-international-hospital",
    "name": "DEL International Hospital",
    "type": "District",
    "departments": [
      "Emergency",
      "Paediatric"
    ],
    "hospital_key": "HGK-DIH-H4VTRR"
  },
  {
    "id": "healthlink-hospital",
    "name": "HealthLink Hospital",
    "type": "Clinic",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-HH-D7ISMM"
  },
  {
    "id": "luccahealth-medical-center",
    "name": "LuccaHealth Medical Center",
    "type": "District",
    "departments": [
      "Emergency",
      "Surgical"
    ],
    "hospital_key": "HGK-LMC-3UHMB2"
  },
  {
    "id": "lekma-hospital",
    "name": "LEKMA Hospital",
    "type": "Regional",
    "departments": [
      "Emergency",
      "General",
      "Maternity",
      "Paediatric"
    ],
    "hospital_key": "HGK-LH-JAJE3G"
  },
  {
    "id": "first-american-specialist-medical-center-accra",
    "name": "First American Specialist Medical Center, Accra",
    "type": "District",
    "departments": [
      "Emergency"
    ],
    "hospital_key": "HGK-FASM-4G58WU"
  }
],
  users: [
  {
    "email": "admin.hospital001@healthgrid.gh",
    "password": "$2b$10$DKdBk1wji5Zm/Z4EYa853u9qTiWWamgXe8P1J0e/Vd7BWQ57tUbnO",
    "role": "hospital_admin",
    "hospital_id": "greater-accra-regional-hospital",
    "department": null,
    "userName": "Greater Accra Regional Hospital Admin"
  },
  {
    "email": "inventory.hospital001@healthgrid.gh",
    "password": "$2b$10$.UX2ps7MXMhcDFQ.uZgiwen3PRsf/6pVTcWRONT6Z2WykJBLM0iNe",
    "role": "inventory_manager",
    "hospital_id": "greater-accra-regional-hospital",
    "department": null,
    "userName": "Greater Accra Regional Hospital Ops Manager"
  },
  {
    "email": "STF-001-EMG-001",
    "password": "$2b$10$VIB3FaOAC7alWSZaV3QNU.pEwwLj6r.q6526DTnnfP1LIm6SwdE96",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-001-EMG-002",
    "password": "$2b$10$/7DHIE7tRUeHGskagjOcL.FAktJlcFYw11ZceRWTt5fPYkhSg0vzS",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-001-ICU-001",
    "password": "$2b$10$//dht6QVUR3FMlnjxXXSbu2UVds8fEQ5ekMgwg1H3O6KpiicKHV5u",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 1"
  },
  {
    "email": "STF-001-ICU-002",
    "password": "$2b$10$3e7eaxlnYhgtWN5oUaszA.VefT0grVbIMQXTm810CBjiAiq4lgGD2",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 2"
  },
  {
    "email": "STF-001-MAT-001",
    "password": "$2b$10$5k/7Nl8vo67Mylk.S7DQcebXQK0xlZl9dEIHtqLZjpsNGjwrlcRPS",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-001-MAT-002",
    "password": "$2b$10$ScIuXJJ2uG6HiFXKXhEKju5o/RoavJ3fk3TZWZ0hXtGUjRJI8fB9u",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-001-SUR-001",
    "password": "$2b$10$..HVCT6smis6yfRQTI8ErO5qYml/yIAGTDzSOsnthhUmxT2SHe4Na",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-001-SUR-002",
    "password": "$2b$10$Hyjtc8NfLA/V0UjIIJLfVOxesv8Lgmf.tkmHJ7CwD78UkzsU/mzcS",
    "role": "hospital_staff",
    "hospital_id": "greater-accra-regional-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "admin.hospital002@healthgrid.gh",
    "password": "$2b$10$.y6ig8G/J6rBBf1GU21uKOj1oQRyrS12cJoYamZ/E.Ga78yUDfxeS",
    "role": "hospital_admin",
    "hospital_id": "claron-health-international",
    "department": null,
    "userName": "Claron Health International Admin"
  },
  {
    "email": "inventory.hospital002@healthgrid.gh",
    "password": "$2b$10$x6mUADEt89Xb3b3lhZEnmO1L0wN7UxQJLpsOlldPXjwL3Qz1oqTmu",
    "role": "inventory_manager",
    "hospital_id": "claron-health-international",
    "department": null,
    "userName": "Claron Health International Ops Manager"
  },
  {
    "email": "STF-002-EMG-001",
    "password": "$2b$10$8ENoig5OKdXhrzdXSuiRsePJy9Q/g416gYsnn9CLZDu0oo8vp5IQW",
    "role": "hospital_staff",
    "hospital_id": "claron-health-international",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-002-EMG-002",
    "password": "$2b$10$T9p6FIyZToh2oCztIML8yeVj6qNUt7JO9SS6UU38yWoSQCbDCaA8m",
    "role": "hospital_staff",
    "hospital_id": "claron-health-international",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-002-GEN-001",
    "password": "$2b$10$l7h.Qbs6S52ZG/rfg.GxgOtNiM8OpPRJQHCTS/s8trvaDlPNAx89S",
    "role": "hospital_staff",
    "hospital_id": "claron-health-international",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-002-GEN-002",
    "password": "$2b$10$iqo8P7F83YMzKIHFkzSpB.8WHT9GYN226p4ET2HOQzYsTqlw5YuDK",
    "role": "hospital_staff",
    "hospital_id": "claron-health-international",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "admin.hospital003@healthgrid.gh",
    "password": "$2b$10$a7UNWfRV3y8OHt8qiSHyGeUDDJu4980z.ZiMa7wbSXcsCw5LdWhHu",
    "role": "hospital_admin",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": null,
    "userName": "University Of Ghana Medical Centre Admin"
  },
  {
    "email": "inventory.hospital003@healthgrid.gh",
    "password": "$2b$10$YqWjA3OGd.wpoJMXtMgwEuOYC6FWZAWT3c.tqaDUvTy4/bouU8ML2",
    "role": "inventory_manager",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": null,
    "userName": "University Of Ghana Medical Centre Ops Manager"
  },
  {
    "email": "STF-003-EMG-001",
    "password": "$2b$10$25poGYpb8p8v/5uVTlElFugX1VroWGnLBlzwa3kqI30jSdRTErzOq",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-003-EMG-002",
    "password": "$2b$10$HdIQFpBZlmheWbbS9nZ4COgDjyltRWXTDExivFuT44uRMKfNOLZOu",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-003-ICU-001",
    "password": "$2b$10$UhUE.NpsKqk5LZMUdjJEXO/WMbuZM2aMzqDN2RPUGMlYJ22bo/Sxe",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "ICU",
    "userName": "ICU Nurse 1"
  },
  {
    "email": "STF-003-ICU-002",
    "password": "$2b$10$tzzCMRqdxgESAg6gRrk6/.bLqBcxyKbF/HOagaSbBOpRBIRPrjN7u",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "ICU",
    "userName": "ICU Nurse 2"
  },
  {
    "email": "STF-003-GEN-001",
    "password": "$2b$10$jSAhp8qA4j4KcwFRa/mlFuw7jDSggX3Xy4xCyGg6wYCR6qtL27c7u",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-003-GEN-002",
    "password": "$2b$10$qM4m4mZfiyXEJUL9BjBRce5Fkb9lSlqD8UHQnbi90Bm2ekf10d.8O",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "STF-003-MAT-001",
    "password": "$2b$10$iIoB62FYnCLCe.k3cQBRIemaBCAiZhF161vmTNVCLzJcIj1G/Sfv.",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-003-MAT-002",
    "password": "$2b$10$bwNE6tWawTcUXy0dErLcHu8tpdZE1aIWsMrrJPAZZ3NeYxJ5OcUNG",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-003-PAE-001",
    "password": "$2b$10$rthk0DFS5ezo6FFH0wwKP.SQRjKSXO.cFqxYxWelb2iYscmcdUlqe",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 1"
  },
  {
    "email": "STF-003-PAE-002",
    "password": "$2b$10$D99Ndw6v50VqkBHbizsC/u8P6PljeMKwQnxTmG6Zhj./0u9sKqLmC",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 2"
  },
  {
    "email": "STF-003-THE-001",
    "password": "$2b$10$sjY06T89wk2MlXgwvkRMxu.ZKo9mP.p37p8MTqY/fTsD0ET8jyoAO",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Theatre",
    "userName": "Theatre Nurse 1"
  },
  {
    "email": "STF-003-THE-002",
    "password": "$2b$10$rzGQlMYeZ4uCCdre8f9pJuMn7yag8utfbiYvfarL8dPoMBJhbIBAm",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Theatre",
    "userName": "Theatre Nurse 2"
  },
  {
    "email": "STF-003-SUR-001",
    "password": "$2b$10$zdpQ1ZQWSf11j/ej2PNjBO9Kda.JEBt2TZEljcj0gdOm3SsPi2scm",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-003-SUR-002",
    "password": "$2b$10$8lSSdBGdxaYOkOECOLeSf.ajN2YBpWMlBHCrDOp4q5X6b/E.mWuSu",
    "role": "hospital_staff",
    "hospital_id": "university-of-ghana-medical-centre",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "admin.hospital004@healthgrid.gh",
    "password": "$2b$10$FnmH4hJ.JswNWvqBgCUoheVP3zkdzSLZsmRHTSzZnl2zt55XQ02ky",
    "role": "hospital_admin",
    "hospital_id": "37-military-hospital",
    "department": null,
    "userName": "37 Military Hospital Admin"
  },
  {
    "email": "inventory.hospital004@healthgrid.gh",
    "password": "$2b$10$g5c.7Jub8zcw/w/UPCtnl.lKGEBLqys6InFolNQj1128fQhjJjHzO",
    "role": "inventory_manager",
    "hospital_id": "37-military-hospital",
    "department": null,
    "userName": "37 Military Hospital Ops Manager"
  },
  {
    "email": "STF-004-ICU-001",
    "password": "$2b$10$bsP8dXBy85YCJTMGsxyHeOc58m6LWZTbJgL8GgZq04on1mSIfVffe",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 1"
  },
  {
    "email": "STF-004-ICU-002",
    "password": "$2b$10$jv6ZE5eWXb/CQipe.8NhKuJhnTkJI46OHYy9A9uuOcowjwRllp4uS",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 2"
  },
  {
    "email": "STF-004-EMG-001",
    "password": "$2b$10$Ao1N1EI5wdfk9C9tqVQ/BeMYC6jZZS1kSDatnnObeAkO5NKTVOkxC",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-004-EMG-002",
    "password": "$2b$10$5rx7IKohwLyKAw68o5T5uO4wfeTkB6PcDLOvsohCWej7Qi0scw4HK",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-004-SUR-001",
    "password": "$2b$10$jlqYxqOG1h2qFoKhypczPeNbUTWIHQ9BMNUMy30wiClPPF/OtOn4S",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-004-SUR-002",
    "password": "$2b$10$ArySowh2hmycESPUZGvlFe1uqsO8P/kBn793nqDTMaQPUEq1ho4WS",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "STF-004-MAT-001",
    "password": "$2b$10$ftZDu3GLxjoLiS1J4QcuF.mWh80MnVpuzr36PpowzZ.XV77/bxIjK",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-004-MAT-002",
    "password": "$2b$10$q0lR7geaZQX4c74iwKLVA.RJhUz2BDcTGTIrL6spi/2.vCYxIUqsW",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-004-GEN-001",
    "password": "$2b$10$bGUJ8.pSQq.J5Uyc7hdcPuufs5Iqo5Q9qNA842ytKslG2LyHBbNBm",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-004-GEN-002",
    "password": "$2b$10$6/gYiqCBd61ITZlVMefyfOCA7Qr8LW69hdZCOjizWN9/srGYPZVSK",
    "role": "hospital_staff",
    "hospital_id": "37-military-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "admin.hospital005@healthgrid.gh",
    "password": "$2b$10$qMf.2nNQvCMoV7fyd8k7wO4QrYkIP0HyHpvjYrzWeP6m86XjqcCZG",
    "role": "hospital_admin",
    "hospital_id": "nyaho-medical-centre",
    "department": null,
    "userName": "Nyaho Medical Centre Admin"
  },
  {
    "email": "inventory.hospital005@healthgrid.gh",
    "password": "$2b$10$.tgIjpZ2CzmOXjedkRdJ/OuG8nAIwRNO5HtlRTQacC5v3F9K.ZErm",
    "role": "inventory_manager",
    "hospital_id": "nyaho-medical-centre",
    "department": null,
    "userName": "Nyaho Medical Centre Ops Manager"
  },
  {
    "email": "STF-005-EMG-001",
    "password": "$2b$10$Xq8cU/bRPS4OVYa5p3SXhOEm6lS1fSmcYb0nGcr8ZZToLG5PkjnTm",
    "role": "hospital_staff",
    "hospital_id": "nyaho-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-005-EMG-002",
    "password": "$2b$10$xJDS8AjsZKN2AW7AAWn6qeOOs238hrruvXQsenTXsir52CjH.Re7W",
    "role": "hospital_staff",
    "hospital_id": "nyaho-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-005-GEN-001",
    "password": "$2b$10$.8CDCxfgRrtbJyUwninD3OAiXTD7zQmHVYhqafyd/IQ9K.5C5lv7q",
    "role": "hospital_staff",
    "hospital_id": "nyaho-medical-centre",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-005-GEN-002",
    "password": "$2b$10$5zmFVf0m/3X9N3Sc/bCZvOP3S1GzQnoGjJO8ROrjAzmM89iiXdroG",
    "role": "hospital_staff",
    "hospital_id": "nyaho-medical-centre",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "admin.hospital006@healthgrid.gh",
    "password": "$2b$10$lXryIgiOQFT.k9tHAS7u8.FWknSjrPAvg6UNYLFekxOB6hgG/hCrK",
    "role": "hospital_admin",
    "hospital_id": "the-bank-hospital",
    "department": null,
    "userName": "The Bank Hospital Admin"
  },
  {
    "email": "inventory.hospital006@healthgrid.gh",
    "password": "$2b$10$RbACjHuB2OK9KfKpsRqin.G.Nb..W9CPdr3zQveCiQi7hQPCN4A6u",
    "role": "inventory_manager",
    "hospital_id": "the-bank-hospital",
    "department": null,
    "userName": "The Bank Hospital Ops Manager"
  },
  {
    "email": "STF-006-EMG-001",
    "password": "$2b$10$C1oKzFqda0zrxC/dRJ/uwOFGaZDI2kHjdsbksRY19Lzi6hEEseud6",
    "role": "hospital_staff",
    "hospital_id": "the-bank-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-006-EMG-002",
    "password": "$2b$10$vZ1sFz3EJn5Fks8WUXcy/eGi34dYQL.1xC.Oc2zxYVn8IQ/9s4Toe",
    "role": "hospital_staff",
    "hospital_id": "the-bank-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-006-GEN-001",
    "password": "$2b$10$p.qvTiw0.f1YflG87WyES.u4LUY7CkEls89gVWvj5hgdrn/3ODX8q",
    "role": "hospital_staff",
    "hospital_id": "the-bank-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-006-GEN-002",
    "password": "$2b$10$ffbGSkkmD/Gd4d8MAgYV6.o/j2MqYYbXrxU9XmEvuYG3Ifauek3pO",
    "role": "hospital_staff",
    "hospital_id": "the-bank-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "STF-006-ICU-001",
    "password": "$2b$10$p/KdJ2HF3qvSB61ssBrm9.hC4qXKBn4SJXTnc.dZCZQtJdsKf5RjW",
    "role": "hospital_staff",
    "hospital_id": "the-bank-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 1"
  },
  {
    "email": "STF-006-ICU-002",
    "password": "$2b$10$8hWsMt6KBN01OdiE23gjk.EoJwslS36Z5wCHz0yHVIX/dfh/AXX6W",
    "role": "hospital_staff",
    "hospital_id": "the-bank-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 2"
  },
  {
    "email": "admin.hospital007@healthgrid.gh",
    "password": "$2b$10$oiom/eO1XzQ0BUTFMA1jbuEWGE8thGJBddAOD7vOCre.M3X3piB6G",
    "role": "hospital_admin",
    "hospital_id": "midway-hospital",
    "department": null,
    "userName": "Midway Hospital Admin"
  },
  {
    "email": "inventory.hospital007@healthgrid.gh",
    "password": "$2b$10$F5iU0NEGiVMcxSAAv.lfN.T/yJWdKaSVK/ysbfUZP3cugwsMyaHUe",
    "role": "inventory_manager",
    "hospital_id": "midway-hospital",
    "department": null,
    "userName": "Midway Hospital Ops Manager"
  },
  {
    "email": "STF-007-EMG-001",
    "password": "$2b$10$D.OReGmIso39LStKFTfZkuYpZCE.6q3mLe1Il6cB6H9rSTJshKnJG",
    "role": "hospital_staff",
    "hospital_id": "midway-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-007-EMG-002",
    "password": "$2b$10$5dxbR9Ti2nYhHz0JrPkwXO8a5bQgNP/XiQ4veiRnou17QmZ5dzg3a",
    "role": "hospital_staff",
    "hospital_id": "midway-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital008@healthgrid.gh",
    "password": "$2b$10$vxs5mGkO.6NYuYolyTuDPOow9TBwYOSxbybkEULpfUGMTqQTFwX7u",
    "role": "hospital_admin",
    "hospital_id": "lifeview-medical-hospital",
    "department": null,
    "userName": "LifeView Medical Hospital Admin"
  },
  {
    "email": "inventory.hospital008@healthgrid.gh",
    "password": "$2b$10$zmw0NboGD5SASaBnfOvAceK0l1i5aa3qDkanO9jyCIBUDfGeDl9/y",
    "role": "inventory_manager",
    "hospital_id": "lifeview-medical-hospital",
    "department": null,
    "userName": "LifeView Medical Hospital Ops Manager"
  },
  {
    "email": "STF-008-EMG-001",
    "password": "$2b$10$d9KRbBW5PQT6XLzkgv3vwegu50is.ml28PnUKdlGie4ldHPhPe7.y",
    "role": "hospital_staff",
    "hospital_id": "lifeview-medical-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-008-EMG-002",
    "password": "$2b$10$ZPxPBsIkphmHEVPVG0rwIOQ4PAWftExMiRba6oKElPhWE02UOlVFG",
    "role": "hospital_staff",
    "hospital_id": "lifeview-medical-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital009@healthgrid.gh",
    "password": "$2b$10$xfhlTm7yBwwKlZzsgQoMQ.1gNj6WqJIM30vVEPL8Z0loqdwD1RLcC",
    "role": "hospital_admin",
    "hospital_id": "achimota-hospital",
    "department": null,
    "userName": "Achimota Hospital Admin"
  },
  {
    "email": "inventory.hospital009@healthgrid.gh",
    "password": "$2b$10$vZra.5xtZV7atvcruzd9w.tpZnoGI6e9WDg/PP0Ns6LfTiXi3CuEa",
    "role": "inventory_manager",
    "hospital_id": "achimota-hospital",
    "department": null,
    "userName": "Achimota Hospital Ops Manager"
  },
  {
    "email": "STF-009-EMG-001",
    "password": "$2b$10$QuWR1C7gFAHa04GY8k45geqPggp3RTyLYAY6PDb9Aig2q6BLeVPJO",
    "role": "hospital_staff",
    "hospital_id": "achimota-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-009-EMG-002",
    "password": "$2b$10$Aaa7cwDsqfadO1JdSQwZNuzhVeDPbVytdZtWEhu0B39uPE.xY7O6W",
    "role": "hospital_staff",
    "hospital_id": "achimota-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-009-GEN-001",
    "password": "$2b$10$77kGAwdIm8lEHSpaSJfxHeZg3h9OQM3ZS3EdpwsjrrKNjxVY64ekW",
    "role": "hospital_staff",
    "hospital_id": "achimota-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-009-GEN-002",
    "password": "$2b$10$DpWvYlySryguksIzft97ruBPGG8.RbA0iZU03Rr2JRq6yCnSEYNYW",
    "role": "hospital_staff",
    "hospital_id": "achimota-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "STF-009-MAT-001",
    "password": "$2b$10$JSxGmpHjiYkRLeN5yXCQmelj1IXQNqCOcmuvniX.8Mi/DytycxrYm",
    "role": "hospital_staff",
    "hospital_id": "achimota-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-009-MAT-002",
    "password": "$2b$10$0ovRjdw7edUHzrATzI/tt.gMRUOk7PD..M31HLaLd/GrgJbqyZYYm",
    "role": "hospital_staff",
    "hospital_id": "achimota-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "admin.hospital010@healthgrid.gh",
    "password": "$2b$10$ALnj6FB9tgs/lfRsfY1Z9OcCTbyCstWgajkji49ATB9Y6xAb40yqG",
    "role": "hospital_admin",
    "hospital_id": "st-michaels-specialist-hospital",
    "department": null,
    "userName": "St Michael's Specialist Hospital Admin"
  },
  {
    "email": "inventory.hospital010@healthgrid.gh",
    "password": "$2b$10$j5Ow3a8GvemLIYHOchS./.GuQULvP6Ninx8J7u1Ilhbvp1xqAgKbK",
    "role": "inventory_manager",
    "hospital_id": "st-michaels-specialist-hospital",
    "department": null,
    "userName": "St Michael's Specialist Hospital Ops Manager"
  },
  {
    "email": "STF-010-EMG-001",
    "password": "$2b$10$53qyfJ7MBxME6zj4m3TpDeNTStwx4Lp9KQSie5KBLvRdz1MSb7Q9.",
    "role": "hospital_staff",
    "hospital_id": "st-michaels-specialist-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-010-EMG-002",
    "password": "$2b$10$t/FConh7tzPMHuXCItLvzeGqMFDBW1Uyh2JiqsktOzAjxNtBpUI4e",
    "role": "hospital_staff",
    "hospital_id": "st-michaels-specialist-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-010-THE-001",
    "password": "$2b$10$wlI8/w/cfOMq5f9muRJDUOPgyhIvCe7NDEW1BDUfq0cWzTGtF7b.m",
    "role": "hospital_staff",
    "hospital_id": "st-michaels-specialist-hospital",
    "department": "Theatre",
    "userName": "Theatre Nurse 1"
  },
  {
    "email": "STF-010-THE-002",
    "password": "$2b$10$O4R.mJV0ZtVg5TDhdouX8eEm/3wLmZKS0gpxW7PQZQ08g1GVZIRQq",
    "role": "hospital_staff",
    "hospital_id": "st-michaels-specialist-hospital",
    "department": "Theatre",
    "userName": "Theatre Nurse 2"
  },
  {
    "email": "admin.hospital011@healthgrid.gh",
    "password": "$2b$10$TJ432JmNvD6HoXvMqTV4J.TQe9ueRCRXkjUQjAz9UKXPyMLRrPkHW",
    "role": "hospital_admin",
    "hospital_id": "ga-east-municipal-hospital",
    "department": null,
    "userName": "GA EAST MUNICIPAL HOSPITAL Admin"
  },
  {
    "email": "inventory.hospital011@healthgrid.gh",
    "password": "$2b$10$cluWBXt6pnVLTk6YzumIuuttrpBOf3w4hTZiThvkXt2SrfWjN66Fa",
    "role": "inventory_manager",
    "hospital_id": "ga-east-municipal-hospital",
    "department": null,
    "userName": "GA EAST MUNICIPAL HOSPITAL Ops Manager"
  },
  {
    "email": "STF-011-EMG-001",
    "password": "$2b$10$C6hiD1h.4qSXcAKsuG7thOraAJPITtSKgUN7ZuR8im8QLAVwIoOjK",
    "role": "hospital_staff",
    "hospital_id": "ga-east-municipal-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-011-EMG-002",
    "password": "$2b$10$eleHceNEZ2iWCJMkJxmmQONVGU98BRyBrfjpX4X9lfbPuvCx4lav.",
    "role": "hospital_staff",
    "hospital_id": "ga-east-municipal-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-011-GEN-001",
    "password": "$2b$10$tMim5XkpDbXYGernf0MDpOjZ5rnaDi7jrT0DlTggO0eqBU.wcHeDi",
    "role": "hospital_staff",
    "hospital_id": "ga-east-municipal-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-011-GEN-002",
    "password": "$2b$10$lVxl1N9JhHG3.WqrDrwq5uatY91qzV2i0PAdUeWQvUVsrkuScMjaC",
    "role": "hospital_staff",
    "hospital_id": "ga-east-municipal-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "admin.hospital012@healthgrid.gh",
    "password": "$2b$10$ZSYY1fNJAr5Ya/0dE0S1W.Ovrb1YQ5TA1O1CLrGW0wUflGo86Onc6",
    "role": "hospital_admin",
    "hospital_id": "healthnet-airport-medical-centre",
    "department": null,
    "userName": "Healthnet Airport Medical Centre Admin"
  },
  {
    "email": "inventory.hospital012@healthgrid.gh",
    "password": "$2b$10$3d/pyF.INEUF/tprSV/6Z.h/C/n8LV8f5caP.m9MPCUf6HS0OqtOC",
    "role": "inventory_manager",
    "hospital_id": "healthnet-airport-medical-centre",
    "department": null,
    "userName": "Healthnet Airport Medical Centre Ops Manager"
  },
  {
    "email": "STF-012-EMG-001",
    "password": "$2b$10$XXRHWaHg9ci40E0bZ4f2ZuIVr7TDGnRy.Ibe721h1KBKjv9HwMgXe",
    "role": "hospital_staff",
    "hospital_id": "healthnet-airport-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-012-EMG-002",
    "password": "$2b$10$eMmpJGmMST7kRdgFMTdWkelcNIi/Y1vr9dzHtW5qHBexukGKH1tzu",
    "role": "hospital_staff",
    "hospital_id": "healthnet-airport-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital013@healthgrid.gh",
    "password": "$2b$10$4xyU28KUEfTvIbCefC3Ttu0RJWxlOydjFZ7du4JnPCcA3rNBgxJNC",
    "role": "hospital_admin",
    "hospital_id": "maamobi-general-hospital",
    "department": null,
    "userName": "Maamobi General Hospital Admin"
  },
  {
    "email": "inventory.hospital013@healthgrid.gh",
    "password": "$2b$10$W6.2wy.qP06otpO0U91uT.jt0RLQ2/NGyNTTvsEero0ZSe1YdPBX2",
    "role": "inventory_manager",
    "hospital_id": "maamobi-general-hospital",
    "department": null,
    "userName": "Maamobi General Hospital Ops Manager"
  },
  {
    "email": "STF-013-EMG-001",
    "password": "$2b$10$HPnohTDaaTwEEk0wavypHecE7zHv9Q33.eR.1lsbGiPcoxCtyFIrS",
    "role": "hospital_staff",
    "hospital_id": "maamobi-general-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-013-EMG-002",
    "password": "$2b$10$R/xdYrPirjrbStH3L3agv.LaJPJ6SsgzgGvCXYwbopwGItQFx6yYi",
    "role": "hospital_staff",
    "hospital_id": "maamobi-general-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-013-GEN-001",
    "password": "$2b$10$HxcwFtUd.xXelG4qdEg4ReYdKFqK5VT4rDEY9Eadnw4KPqvrF.Q9C",
    "role": "hospital_staff",
    "hospital_id": "maamobi-general-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-013-GEN-002",
    "password": "$2b$10$L58kYsNw.A87RvWxO1GqHehOHNm9vmOewjoPO.ai/NTzNOIAP3z8u",
    "role": "hospital_staff",
    "hospital_id": "maamobi-general-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "STF-013-MAT-001",
    "password": "$2b$10$RDmqZFwrNJpbgb782akbQ.TcHed3UfqJ9SzGSkPSIxhcwCtoW2Foi",
    "role": "hospital_staff",
    "hospital_id": "maamobi-general-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-013-MAT-002",
    "password": "$2b$10$d/2kPcNbz2LfFl4gIKTwue5YjnVVgk1wdEvkg9Z782nnpZ8HsWmSO",
    "role": "hospital_staff",
    "hospital_id": "maamobi-general-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "admin.hospital014@healthgrid.gh",
    "password": "$2b$10$4vD1YLRB/6sm2zCjiGLjz.VpvbCghMU9UAtT6QnHhARWRq548Wsq2",
    "role": "hospital_admin",
    "hospital_id": "aims-hospital",
    "department": null,
    "userName": "AIMS Hospital Admin"
  },
  {
    "email": "inventory.hospital014@healthgrid.gh",
    "password": "$2b$10$HuuBgBxt69yfJHOF8EdcHOKz8lwHxm7yWU41dZAZVe8tI6EQcI9TG",
    "role": "inventory_manager",
    "hospital_id": "aims-hospital",
    "department": null,
    "userName": "AIMS Hospital Ops Manager"
  },
  {
    "email": "STF-014-EMG-001",
    "password": "$2b$10$jV3g55vDLQoPrIQS4NrZlOsHGmtGpxmx6YiYDFkOFnUj0xN9ZKjFi",
    "role": "hospital_staff",
    "hospital_id": "aims-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-014-EMG-002",
    "password": "$2b$10$hnjrkj4ECZdZcIB2He8FOuPyAyD8Dw6CWbE3DJJKiqmNvLtcMzX9W",
    "role": "hospital_staff",
    "hospital_id": "aims-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital015@healthgrid.gh",
    "password": "$2b$10$qlqF5fp.IO95N7Ijif5zNen/pozsLArbSJZ/t.GXEqVNboVNEdjCa",
    "role": "hospital_admin",
    "hospital_id": "rayan-medical-centre",
    "department": null,
    "userName": "Rayan Medical Centre Admin"
  },
  {
    "email": "inventory.hospital015@healthgrid.gh",
    "password": "$2b$10$Xs4gdNieaVkyLGYri28DGOhX7e0FbGSwPJ.HeZUhrIEREZErZCwSS",
    "role": "inventory_manager",
    "hospital_id": "rayan-medical-centre",
    "department": null,
    "userName": "Rayan Medical Centre Ops Manager"
  },
  {
    "email": "STF-015-EMG-001",
    "password": "$2b$10$8KCcVlp8n3Z/86e0tNretuQpHGkgJkNDw2ZUuyokvazcdXRTKeiXS",
    "role": "hospital_staff",
    "hospital_id": "rayan-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-015-EMG-002",
    "password": "$2b$10$tIRj1C.AyrLJi8nkj6JmdeU0L55VeKSFndT4PaeC7eh07I2YBNBbm",
    "role": "hospital_staff",
    "hospital_id": "rayan-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital016@healthgrid.gh",
    "password": "$2b$10$FXoLZOlY4h6FLjSxk8NHwOkzDt9/.i8J5TtJ6xBzt/Ok14v2dKMCe",
    "role": "hospital_admin",
    "hospital_id": "accra-medical-centre",
    "department": null,
    "userName": "Accra Medical Centre Admin"
  },
  {
    "email": "inventory.hospital016@healthgrid.gh",
    "password": "$2b$10$OLyT8YHlULaoBfN.m2QbA.bwxEUSJaHKkLtFS1nrjjn3du/ufageO",
    "role": "inventory_manager",
    "hospital_id": "accra-medical-centre",
    "department": null,
    "userName": "Accra Medical Centre Ops Manager"
  },
  {
    "email": "STF-016-EMG-001",
    "password": "$2b$10$xc3d.umB6k4a92Qe1asxseHyyiTwo9XSCqA20kPwV0PvsSUC9I3Ly",
    "role": "hospital_staff",
    "hospital_id": "accra-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-016-EMG-002",
    "password": "$2b$10$UhE6tyN7N96thIPNnTGkY.63weJTHEFuUXYP5V7E5k.StcZHwZZTG",
    "role": "hospital_staff",
    "hospital_id": "accra-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-016-GEN-001",
    "password": "$2b$10$QKS3NgWkqAJNMRU55254te8yTbXS7SCjduu0/uYF7BPmw1dKx2mYu",
    "role": "hospital_staff",
    "hospital_id": "accra-medical-centre",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-016-GEN-002",
    "password": "$2b$10$NXF/V6qKduRwtDkTsU/1xuHfrqB4K.eQUPBGr46VsyZlmaz6o6KqO",
    "role": "hospital_staff",
    "hospital_id": "accra-medical-centre",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "admin.hospital017@healthgrid.gh",
    "password": "$2b$10$u96vbJpxQD7.BH1Yth0KEOC54zeYwu6gciarLCqkfChsvyJYOHVpe",
    "role": "hospital_admin",
    "hospital_id": "st-kathryns-hospital",
    "department": null,
    "userName": "St. Kathryn's Hospital Admin"
  },
  {
    "email": "inventory.hospital017@healthgrid.gh",
    "password": "$2b$10$eYSrTwMswcmphNWVTI75.eO4yW6jtToN60ppMyrfXZBv1wF4Q7R16",
    "role": "inventory_manager",
    "hospital_id": "st-kathryns-hospital",
    "department": null,
    "userName": "St. Kathryn's Hospital Ops Manager"
  },
  {
    "email": "STF-017-EMG-001",
    "password": "$2b$10$OJn.PnRrqs/k5ixeaQChze4Gp03bM6HrRkqkz2/l1tNDIfHm8JrWa",
    "role": "hospital_staff",
    "hospital_id": "st-kathryns-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-017-EMG-002",
    "password": "$2b$10$dQT6zhKE9jb26exgET/qSOMJi4wNdmlfDgW9RYRATnBoZyjqcSt/m",
    "role": "hospital_staff",
    "hospital_id": "st-kathryns-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital018@healthgrid.gh",
    "password": "$2b$10$EShPqznc5iRO5qOrO3LBOukFhCGa7Xi6jWPbFEfAd32eQiwyPk70u",
    "role": "hospital_admin",
    "hospital_id": "valley-view-medical-center",
    "department": null,
    "userName": "Valley View Medical Center Admin"
  },
  {
    "email": "inventory.hospital018@healthgrid.gh",
    "password": "$2b$10$QL8xQO9592si02GmbQWHze6VFarAYImC1KviRI/50YbYreW8yikIS",
    "role": "inventory_manager",
    "hospital_id": "valley-view-medical-center",
    "department": null,
    "userName": "Valley View Medical Center Ops Manager"
  },
  {
    "email": "STF-018-EMG-001",
    "password": "$2b$10$l88.3Ik.i1.maCjl/FciyuYJBvuUFHa9.tplldeR.E8fCJF7U41KC",
    "role": "hospital_staff",
    "hospital_id": "valley-view-medical-center",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-018-EMG-002",
    "password": "$2b$10$.Rls5fPhmk0ZTzC5yr6pBu9gGU3.EogshD5Srqf5U1br0J3hadY1q",
    "role": "hospital_staff",
    "hospital_id": "valley-view-medical-center",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital019@healthgrid.gh",
    "password": "$2b$10$uKEU47PLJFt/mfwndhRNA.oRyMvEOE0NLn4YUgtuMVmGcHL/asBvG",
    "role": "hospital_admin",
    "hospital_id": "crown-medical-centre-accra-ghana",
    "department": null,
    "userName": "Crown Medical Centre, Accra - Ghana Admin"
  },
  {
    "email": "inventory.hospital019@healthgrid.gh",
    "password": "$2b$10$uy2KV8YcZBb8THIGm2Q8vOYvFa9VhfCy0/mEuTnMdMwvZEdom5DrG",
    "role": "inventory_manager",
    "hospital_id": "crown-medical-centre-accra-ghana",
    "department": null,
    "userName": "Crown Medical Centre, Accra - Ghana Ops Manager"
  },
  {
    "email": "STF-019-EMG-001",
    "password": "$2b$10$9vrOf0n0A4ifTP355aHBTuwURwTeRVCaRG8HQ8UpXOYinbWry3dxy",
    "role": "hospital_staff",
    "hospital_id": "crown-medical-centre-accra-ghana",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-019-EMG-002",
    "password": "$2b$10$6vyVyJbOXesdpX9QUbUx6uh64UlToySMqLSV4ceI/O7cDQW34Kzli",
    "role": "hospital_staff",
    "hospital_id": "crown-medical-centre-accra-ghana",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital020@healthgrid.gh",
    "password": "$2b$10$eI6ZuttXbmbfrQLBfSzSL.k1yKey70GvjBEcc/cA4IHSSBFnQ6N6.",
    "role": "hospital_admin",
    "hospital_id": "airport-womens-hospital",
    "department": null,
    "userName": "Airport Women's Hospital Admin"
  },
  {
    "email": "inventory.hospital020@healthgrid.gh",
    "password": "$2b$10$xwSOGzPa1QXri9NElpLvj.AGFe4O7pdhALP5McimbbsrPAXdR3twu",
    "role": "inventory_manager",
    "hospital_id": "airport-womens-hospital",
    "department": null,
    "userName": "Airport Women's Hospital Ops Manager"
  },
  {
    "email": "STF-020-EMG-001",
    "password": "$2b$10$M8CQkVd54AKyqWXwFaXLy.6mM2C4EkfNVopdg1JXgOg5hgYN7ndxG",
    "role": "hospital_staff",
    "hospital_id": "airport-womens-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-020-EMG-002",
    "password": "$2b$10$UJd/h0r/a2dWbIpiUMvZCuDW5IR3XToUxO9IzoSx6WTPpXEXIVPna",
    "role": "hospital_staff",
    "hospital_id": "airport-womens-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-020-MAT-001",
    "password": "$2b$10$hJO8nTep9ZOlBQsfEgRQNOk1R6VxCHAFCdVyHddCPfeKR9bzvZxI2",
    "role": "hospital_staff",
    "hospital_id": "airport-womens-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-020-MAT-002",
    "password": "$2b$10$rPzh0mw4i4NaU/Ie4Lefm.5URfP5jDzFQsTqi0AyH.ga8GrgLKsMK",
    "role": "hospital_staff",
    "hospital_id": "airport-womens-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-020-PAE-001",
    "password": "$2b$10$ENFhjNR/XwlQxBm7.MZEqeE3WDpqVTMxvePiQDn2U1h4zfv0xAdtq",
    "role": "hospital_staff",
    "hospital_id": "airport-womens-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 1"
  },
  {
    "email": "STF-020-PAE-002",
    "password": "$2b$10$yPrBtu3zEignlT.bV9v/veTR8EJdD8AOVckuXEL2viSKZmkxQZISW",
    "role": "hospital_staff",
    "hospital_id": "airport-womens-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 2"
  },
  {
    "email": "admin.hospital021@healthgrid.gh",
    "password": "$2b$10$WeVMa9IYN41zd8AigQO1X.a12u0r2Y8soemGjZxQSeYGdWs4v2BVW",
    "role": "hospital_admin",
    "hospital_id": "north-legon-hospital",
    "department": null,
    "userName": "North Legon Hospital Admin"
  },
  {
    "email": "inventory.hospital021@healthgrid.gh",
    "password": "$2b$10$s4iW1a738lJ3gEdsLFU75eu97KXeegfa.qnGQQhjVaq3QHth0U6nu",
    "role": "inventory_manager",
    "hospital_id": "north-legon-hospital",
    "department": null,
    "userName": "North Legon Hospital Ops Manager"
  },
  {
    "email": "STF-021-EMG-001",
    "password": "$2b$10$1sE3qFpyNKDO/I9Rq2gIEuS6sOB2L0epISsvvDuVHdx4o7GIFzo3S",
    "role": "hospital_staff",
    "hospital_id": "north-legon-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-021-EMG-002",
    "password": "$2b$10$yD4NcbIJoXPPthmWPiAex./ar0VKJuLe1yzhfbnuwzk9mZzsrVpkG",
    "role": "hospital_staff",
    "hospital_id": "north-legon-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-021-MAT-001",
    "password": "$2b$10$ueIa8syieyE2PSEkkVBH.eniSH7aZuAHHrSTvQswZpmM5dcTqaElq",
    "role": "hospital_staff",
    "hospital_id": "north-legon-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-021-MAT-002",
    "password": "$2b$10$bgFSO5BGv3BWgVwngG4EOOqFrWlmHDgXmHWQnnRZ28p8zhlyT9FcW",
    "role": "hospital_staff",
    "hospital_id": "north-legon-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-021-PAE-001",
    "password": "$2b$10$8Kju4.aDZVgwOawzbItMq.lEEBDLIKso5NR09yGt7xoYeooKhiqkm",
    "role": "hospital_staff",
    "hospital_id": "north-legon-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 1"
  },
  {
    "email": "STF-021-PAE-002",
    "password": "$2b$10$drfNsC1Jm4xFvXNyum54O.KEhfFhGxIf64IUTcMS4My5bqFMnzpIi",
    "role": "hospital_staff",
    "hospital_id": "north-legon-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 2"
  },
  {
    "email": "admin.hospital022@healthgrid.gh",
    "password": "$2b$10$UiO7P/VuDEBuU3F5Nc/6D.juTbKmuynKfcJhz4x0BykY4kuUsC5Jq",
    "role": "hospital_admin",
    "hospital_id": "police-hospital",
    "department": null,
    "userName": "Police Hospital Admin"
  },
  {
    "email": "inventory.hospital022@healthgrid.gh",
    "password": "$2b$10$SOs29Q/.jZQhRmtttecU0ulsFsZw89FPbjZ5ipb.WY8mCrkISFa0e",
    "role": "inventory_manager",
    "hospital_id": "police-hospital",
    "department": null,
    "userName": "Police Hospital Ops Manager"
  },
  {
    "email": "STF-022-EMG-001",
    "password": "$2b$10$ZXj8odhTO8YBLOYCDWmBFuE8bCF9QGwfDNlYtaYL/mHECfXSp10J2",
    "role": "hospital_staff",
    "hospital_id": "police-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-022-EMG-002",
    "password": "$2b$10$lCZUCQvt27DLWCUc5opjfO3tniqjmXw8IaDeY3cIdPGfTBZcniBd6",
    "role": "hospital_staff",
    "hospital_id": "police-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-022-GEN-001",
    "password": "$2b$10$NaicgRo08O80dhdhSCgCMe3ZUJpjH5xVHuzfwz/8srdL0xIsuDZmy",
    "role": "hospital_staff",
    "hospital_id": "police-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-022-GEN-002",
    "password": "$2b$10$eUe5Da9Hc/bGWyKG6F9eA.BofEIQKewgfGRkhDqkaqlWNoukUuE.a",
    "role": "hospital_staff",
    "hospital_id": "police-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "STF-022-THE-001",
    "password": "$2b$10$hjiDiM3lCcQjkKSsFyrO8u7DaGlB3xN63Vw.fu/g8ljOMyYygRA/m",
    "role": "hospital_staff",
    "hospital_id": "police-hospital",
    "department": "Theatre",
    "userName": "Theatre Nurse 1"
  },
  {
    "email": "STF-022-THE-002",
    "password": "$2b$10$D.vyvyn1AmScUreU6xGKru1zqzwGQbVVjj3ETc2.nqZWw.BcV/T8O",
    "role": "hospital_staff",
    "hospital_id": "police-hospital",
    "department": "Theatre",
    "userName": "Theatre Nurse 2"
  },
  {
    "email": "admin.hospital023@healthgrid.gh",
    "password": "$2b$10$I6MdlrkS/AAXm4hyw3ZtOuLEbO.ukco6I/FKOdpmW8PMyzQvNQi9G",
    "role": "hospital_admin",
    "hospital_id": "the-trust-hospital-osu",
    "department": null,
    "userName": "The Trust Hospital, Osu Admin"
  },
  {
    "email": "inventory.hospital023@healthgrid.gh",
    "password": "$2b$10$YMNzLyY0A0MAwFFoDTvll.XTV47OreTrTmK8qctgKzxAXpaIR8PUS",
    "role": "inventory_manager",
    "hospital_id": "the-trust-hospital-osu",
    "department": null,
    "userName": "The Trust Hospital, Osu Ops Manager"
  },
  {
    "email": "STF-023-EMG-001",
    "password": "$2b$10$9W1PtSATbYWUd0kqKGJr.ua76v64.e3DSduChk1n/n/55iwlxk8rK",
    "role": "hospital_staff",
    "hospital_id": "the-trust-hospital-osu",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-023-EMG-002",
    "password": "$2b$10$WrXxsfBPeSriQCjipb3N..Dm1w8U47n4gdhAw0KD2xgedlECd5VjO",
    "role": "hospital_staff",
    "hospital_id": "the-trust-hospital-osu",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-023-SUR-001",
    "password": "$2b$10$yuGtwMF9qfYPwzXp9mNSA.zIwo/.zPU/lEuH0pPw87gOFveSXKEme",
    "role": "hospital_staff",
    "hospital_id": "the-trust-hospital-osu",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-023-SUR-002",
    "password": "$2b$10$/uD19EJ4gWmcdA7jeVxZkO1gaAKWgcsL7zmTWVNowUBg8932EA3LS",
    "role": "hospital_staff",
    "hospital_id": "the-trust-hospital-osu",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "STF-023-ICU-001",
    "password": "$2b$10$YX8RMZzJB6cLEnZdSBYACueA3c7W6aIPMB/h8twLCw3AWQLd5cP06",
    "role": "hospital_staff",
    "hospital_id": "the-trust-hospital-osu",
    "department": "ICU",
    "userName": "ICU Nurse 1"
  },
  {
    "email": "STF-023-ICU-002",
    "password": "$2b$10$ZZacdYdUv6eQAct9/.Vn7etttk4OvsXi5DHYGCoCEB4BpUr0KplSe",
    "role": "hospital_staff",
    "hospital_id": "the-trust-hospital-osu",
    "department": "ICU",
    "userName": "ICU Nurse 2"
  },
  {
    "email": "admin.hospital024@healthgrid.gh",
    "password": "$2b$10$U9TPZKr2z5dBywCokadgNeVrVwvdGeQb4yWi2DqvS37WLZIOhPMPq",
    "role": "hospital_admin",
    "hospital_id": "holy-trinity-medical-centre",
    "department": null,
    "userName": "Holy Trinity Medical Centre Admin"
  },
  {
    "email": "inventory.hospital024@healthgrid.gh",
    "password": "$2b$10$pkmc0aFHqkB70FStX/3rv.DM8MlAkti6GkqMyDnyRyR074eWVGYpq",
    "role": "inventory_manager",
    "hospital_id": "holy-trinity-medical-centre",
    "department": null,
    "userName": "Holy Trinity Medical Centre Ops Manager"
  },
  {
    "email": "STF-024-EMG-001",
    "password": "$2b$10$rrcrcjua.6oWVSbfxzXuUe7zEyVPvcK6XEoXeYWNzjMM6Bd/esht.",
    "role": "hospital_staff",
    "hospital_id": "holy-trinity-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-024-EMG-002",
    "password": "$2b$10$XbtnTCuMDviv8/PJknI/2ezmeGU13boKhWY58FBUXUhtwMMIR4tdO",
    "role": "hospital_staff",
    "hospital_id": "holy-trinity-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital025@healthgrid.gh",
    "password": "$2b$10$cajr10SX01o.IowPwVA59.t2hs1u0eBYyM7InXBHHMoHKws/hYLsi",
    "role": "hospital_admin",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": null,
    "userName": "Korle Bu Teaching Hospital Admin"
  },
  {
    "email": "inventory.hospital025@healthgrid.gh",
    "password": "$2b$10$A1viZBWADh5jWWsZjgqpfOU4Q6ebxcJdxSflrrO/MZr.JtgqhD3Uu",
    "role": "inventory_manager",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": null,
    "userName": "Korle Bu Teaching Hospital Ops Manager"
  },
  {
    "email": "STF-025-ICU-001",
    "password": "$2b$10$4YvkCCUE0i0YCqGpZYd56utIgVZ74GW300Qdc29aio7N35/s2TEGW",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 1"
  },
  {
    "email": "STF-025-ICU-002",
    "password": "$2b$10$JwvJMKsUl8Qjdvb34uX8qug2AbkzkIsD0XA5MOhH1FPD7LZ7Z5Sfy",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "ICU",
    "userName": "ICU Nurse 2"
  },
  {
    "email": "STF-025-EMG-001",
    "password": "$2b$10$J/PHZEBQHbHgzwRj/VCkau3hxCO5k5Iby68hlwhiQ7KOLM729eSXy",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-025-EMG-002",
    "password": "$2b$10$5cPxonXcDCiHi8vVIUkqAOq1MSVzlP424uBZzqU7eB1SH3r.sNrie",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-025-MAT-001",
    "password": "$2b$10$zfilb47bQ12LYPBwGbNIU.y2V81kJCqJEIWEiJV.BfEjPvTxFq6GC",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-025-MAT-002",
    "password": "$2b$10$hx8i4hLMxteDakqcMLtqQOANsPV2gZPU4.suLD./R1HNTUiF.1tL6",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-025-SUR-001",
    "password": "$2b$10$2kgWrI0t/V/gT.3Hvj.39.Z21ce67TY6wJphUnleMOC5Jv99n9HWS",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-025-SUR-002",
    "password": "$2b$10$YOehobBJrqgDwuGN7SWtTePlqjwmrghJGf7SJGZYXn6zE2lwcMSWa",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "STF-025-ONC-001",
    "password": "$2b$10$Mv3TUawsdnj4ZWK8kHqU9ea10cXGtFtFiR9epuGIoOSG43SwM1LqS",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Oncology",
    "userName": "Oncology Nurse 1"
  },
  {
    "email": "STF-025-ONC-002",
    "password": "$2b$10$mDGq1T8G/UecQeMxPQI7YO4NyuCZ.8nJjQoVPOdyciVt1TbaQQmPm",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Oncology",
    "userName": "Oncology Nurse 2"
  },
  {
    "email": "STF-025-PAE-001",
    "password": "$2b$10$n/I/kMvSfGg0CINqZuYQuujyL49vMg9FyR/QklcyOhxsz5iOHOyY6",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 1"
  },
  {
    "email": "STF-025-PAE-002",
    "password": "$2b$10$cObbJP7Qy6u9BLByns9lYOggyVI42jajMAbS028OXMWvoz9iBE6Hq",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 2"
  },
  {
    "email": "STF-025-THE-001",
    "password": "$2b$10$XE/BiluBHCWCD1ZBPQFQJ.6XIbCEiiPQb2tg0K51BD0zLfKcGvMZu",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Theatre",
    "userName": "Theatre Nurse 1"
  },
  {
    "email": "STF-025-THE-002",
    "password": "$2b$10$RXGLNRE2.LmwKLs66BubvOWUZfdhoAl5eLb0AQt7UDmjBfj1Gm0r.",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Theatre",
    "userName": "Theatre Nurse 2"
  },
  {
    "email": "STF-025-LAB-001",
    "password": "$2b$10$FYuRwor7gx9BrQeS8ibYY.j8eOux45We5TE/OTq74i7.2ImMiUw/C",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Laboratory",
    "userName": "Laboratory Nurse 1"
  },
  {
    "email": "STF-025-LAB-002",
    "password": "$2b$10$6ckqFdFVrvPj8hPWedp1YeQXjN6kvdU0kUvkpC5LQI.ScWH6bhFvi",
    "role": "hospital_staff",
    "hospital_id": "korle-bu-teaching-hospital",
    "department": "Laboratory",
    "userName": "Laboratory Nurse 2"
  },
  {
    "email": "admin.hospital026@healthgrid.gh",
    "password": "$2b$10$kyhUYQ/Xo2MNKAcBZJGM9.Nc/Biz5V7Z8.e7/CP2PSYD17Gm8OSDS",
    "role": "hospital_admin",
    "hospital_id": "university-hospital-legon",
    "department": null,
    "userName": "University Hospital - Legon Admin"
  },
  {
    "email": "inventory.hospital026@healthgrid.gh",
    "password": "$2b$10$Wnd.hDtlZCqRSTppRtfloOEC9N7EKgDO6/nl4PLTX95BPifVMsj5C",
    "role": "inventory_manager",
    "hospital_id": "university-hospital-legon",
    "department": null,
    "userName": "University Hospital - Legon Ops Manager"
  },
  {
    "email": "STF-026-EMG-001",
    "password": "$2b$10$nCZ0V/xT1t.lfQIjXcSN7OElGzilCZZA8gqJFmNt893KHGSp0n116",
    "role": "hospital_staff",
    "hospital_id": "university-hospital-legon",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-026-EMG-002",
    "password": "$2b$10$EOjHyD6ZbEqYK79Bw8ezLuWrTF0R5sa/wfvRZuinrLVKvTJ4TEQbC",
    "role": "hospital_staff",
    "hospital_id": "university-hospital-legon",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-026-MAT-001",
    "password": "$2b$10$yQ5VjZoYxnN/pXq7k//0J.Y7MVqmMqE1ocMzZ7axitEKKIEQXqOw6",
    "role": "hospital_staff",
    "hospital_id": "university-hospital-legon",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-026-MAT-002",
    "password": "$2b$10$ie.3BsUte2.uVQICRNqtK.wGA1N3fcNo2H//0r7SKO7wnAtXZat3a",
    "role": "hospital_staff",
    "hospital_id": "university-hospital-legon",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-026-PAE-001",
    "password": "$2b$10$ch/FdhdSKqdg4bNYmXXMieTmIkPsW.g/mbJ7bH5rRmqpO0JQlwsr6",
    "role": "hospital_staff",
    "hospital_id": "university-hospital-legon",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 1"
  },
  {
    "email": "STF-026-PAE-002",
    "password": "$2b$10$vtylOTHepNwwv/zApbfjTuGIRPbALmvM6GpIH3PgoZ7oIxtrYZ3qy",
    "role": "hospital_staff",
    "hospital_id": "university-hospital-legon",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 2"
  },
  {
    "email": "admin.hospital027@healthgrid.gh",
    "password": "$2b$10$4ZFOFBgceeJ..ogze0BBKuDdvH7EbkQheec8jj1TPqCAWEfOdqt9i",
    "role": "hospital_admin",
    "hospital_id": "family-health-hospital",
    "department": null,
    "userName": "Family Health Hospital Admin"
  },
  {
    "email": "inventory.hospital027@healthgrid.gh",
    "password": "$2b$10$xn5HlxGiF7YPi1/.m5vEu.nyrzbyxY6x4kaJqJoR99l8KFb9gghhq",
    "role": "inventory_manager",
    "hospital_id": "family-health-hospital",
    "department": null,
    "userName": "Family Health Hospital Ops Manager"
  },
  {
    "email": "STF-027-EMG-001",
    "password": "$2b$10$Z5Ey9EgYEW0EcjNVvttsFe5IFxiTtPkD97pYlYWoXDdlGWVDpKVAy",
    "role": "hospital_staff",
    "hospital_id": "family-health-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-027-EMG-002",
    "password": "$2b$10$weEsOm3HfnQGS3Yy.ZUe8uptSAEWfbvZaVyZvcQB.XXCB8VFi8cLq",
    "role": "hospital_staff",
    "hospital_id": "family-health-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital028@healthgrid.gh",
    "password": "$2b$10$yAthszWOQnpUdzUPFamwz.NtKw22dpeJTDoucILm95KS2.xizMHZ.",
    "role": "hospital_admin",
    "hospital_id": "accra-newtown-islamic-hospital",
    "department": null,
    "userName": "Accra Newtown Islamic Hospital Admin"
  },
  {
    "email": "inventory.hospital028@healthgrid.gh",
    "password": "$2b$10$dUd8pzc1G/25pBVuk8nThOo8At6jmzVVNNOiWywjTR3Wk21uo7ZCK",
    "role": "inventory_manager",
    "hospital_id": "accra-newtown-islamic-hospital",
    "department": null,
    "userName": "Accra Newtown Islamic Hospital Ops Manager"
  },
  {
    "email": "STF-028-EMG-001",
    "password": "$2b$10$c6FHCr5a8rDb5xKJ9eFDpeRXGDNStsvOkLp3UwWBkVG3MJkXL4sBa",
    "role": "hospital_staff",
    "hospital_id": "accra-newtown-islamic-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-028-EMG-002",
    "password": "$2b$10$0KYZJQxbPC/EorxDQY21t.q.NtkFhyRADOnEZQNoubSc0QAYf/ivK",
    "role": "hospital_staff",
    "hospital_id": "accra-newtown-islamic-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital029@healthgrid.gh",
    "password": "$2b$10$KCA9Z/4f/Me0Mk6Ogc9vpOmuhqyaaFJSfQ1xq4kVm5WeyyPw2kDDC",
    "role": "hospital_admin",
    "hospital_id": "lapaz-community-hospital-annex-a",
    "department": null,
    "userName": "Lapaz community hospital Annex A Admin"
  },
  {
    "email": "inventory.hospital029@healthgrid.gh",
    "password": "$2b$10$ZbiqIoF3ORweprAH0ZtrGOKC7e0iQF5Q6aVomAUdQUAcvuQ3fxQxu",
    "role": "inventory_manager",
    "hospital_id": "lapaz-community-hospital-annex-a",
    "department": null,
    "userName": "Lapaz community hospital Annex A Ops Manager"
  },
  {
    "email": "STF-029-EMG-001",
    "password": "$2b$10$EYt6ltT9OBBLEcEsuo3bTuilPFABc0/uimOfNKDKHx2yU0szTPI9W",
    "role": "hospital_staff",
    "hospital_id": "lapaz-community-hospital-annex-a",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-029-EMG-002",
    "password": "$2b$10$Pmm4cm3H2wK7MoA39Pu4AOcLuIF4xGhAiOcLdSZF9CJI5Cf9l1NC6",
    "role": "hospital_staff",
    "hospital_id": "lapaz-community-hospital-annex-a",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital030@healthgrid.gh",
    "password": "$2b$10$V/ogjSzNgccjwliUYQjv9uqJU0dvRePt2Mgit8FfhTCQYDNU3KoZq",
    "role": "hospital_admin",
    "hospital_id": "focos-orthopaedic-hospital",
    "department": null,
    "userName": "FOCOS Orthopaedic Hospital Admin"
  },
  {
    "email": "inventory.hospital030@healthgrid.gh",
    "password": "$2b$10$mPiS8Gh1a8r2rJMZK3NNt.9R7dHlXkSTTyshTJmlBuhL5Qof0Qi86",
    "role": "inventory_manager",
    "hospital_id": "focos-orthopaedic-hospital",
    "department": null,
    "userName": "FOCOS Orthopaedic Hospital Ops Manager"
  },
  {
    "email": "STF-030-EMG-001",
    "password": "$2b$10$mU4EP1MeIna0JvOhCFeSou4hroXqgEmpxFRgz58.H5Y8NIzgj1G/m",
    "role": "hospital_staff",
    "hospital_id": "focos-orthopaedic-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-030-EMG-002",
    "password": "$2b$10$2m1Ih4MXr5KLSue2LV713uH7qVdHT1Vuen2525DWJ2N3IT5QuM4Fm",
    "role": "hospital_staff",
    "hospital_id": "focos-orthopaedic-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-030-SUR-001",
    "password": "$2b$10$Lkp8BF0mLyhLNnh5gbDtb.OhZ4.wp8YAVUd.o.20cNMQiDVbf.KJi",
    "role": "hospital_staff",
    "hospital_id": "focos-orthopaedic-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-030-SUR-002",
    "password": "$2b$10$XX6PlDtmp8O/.QPRm/sl4.6LZ9on2drvFAe10mmQrak7ntS0ORqcm",
    "role": "hospital_staff",
    "hospital_id": "focos-orthopaedic-hospital",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "admin.hospital031@healthgrid.gh",
    "password": "$2b$10$VT8MUQ9QQ7gKThMFSrwA9OXyeUyZHZjhanZPnpAh5FfVG.xqnjnOq",
    "role": "hospital_admin",
    "hospital_id": "providence-specialists-hospital",
    "department": null,
    "userName": "Providence Specialists Hospital Admin"
  },
  {
    "email": "inventory.hospital031@healthgrid.gh",
    "password": "$2b$10$9JzxX..152wf0jnCNqC4v.rzWCRFXN00iyDgNqCUAcGdHNm.pf5jm",
    "role": "inventory_manager",
    "hospital_id": "providence-specialists-hospital",
    "department": null,
    "userName": "Providence Specialists Hospital Ops Manager"
  },
  {
    "email": "STF-031-EMG-001",
    "password": "$2b$10$lZ7tuZyZSpKOTbtACeApnuCjj7wFw5g2Y741pWQmD79UJ6Sce6APe",
    "role": "hospital_staff",
    "hospital_id": "providence-specialists-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-031-EMG-002",
    "password": "$2b$10$Wj4zDmO3Q5rJ2iUNTwgv.eMWbQyv19Fm1ODm5bVzSnIeu2A6q4W/S",
    "role": "hospital_staff",
    "hospital_id": "providence-specialists-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital032@healthgrid.gh",
    "password": "$2b$10$LfhYJoUblf63o0Ay8LbBQeB/6QYWuebdvtRGCzmlNVgzJ0PV7z24G",
    "role": "hospital_admin",
    "hospital_id": "a-a-family-hospital",
    "department": null,
    "userName": "A & A Family Hospital Admin"
  },
  {
    "email": "inventory.hospital032@healthgrid.gh",
    "password": "$2b$10$tz4Ao1cxRQgKD4pRRtyzsuRHvZ.aI7zaXc9Jdj8KrV6X565Bf0cFW",
    "role": "inventory_manager",
    "hospital_id": "a-a-family-hospital",
    "department": null,
    "userName": "A & A Family Hospital Ops Manager"
  },
  {
    "email": "STF-032-EMG-001",
    "password": "$2b$10$mpf8teX08qNE2Z3sogay0eO4Vpuf9owEiXHOeEJeu/5n2F5yIqktO",
    "role": "hospital_staff",
    "hospital_id": "a-a-family-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-032-EMG-002",
    "password": "$2b$10$PlyJiBCmtNEMVQZr/1VKY.I5Eqk1Vg1xayPWj7Kmc1NPcjaIBKOQy",
    "role": "hospital_staff",
    "hospital_id": "a-a-family-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital033@healthgrid.gh",
    "password": "$2b$10$oJA5CM51L2W83/s5qWhFIOj5gtQD6epoZCwvlih84ZBQlx9QXz2bK",
    "role": "hospital_admin",
    "hospital_id": "solis-hospital",
    "department": null,
    "userName": "Solis Hospital Admin"
  },
  {
    "email": "inventory.hospital033@healthgrid.gh",
    "password": "$2b$10$XDzlXRUaewMcrWyT/8Jdwux2l0DoQrFjOKiloaAGCuYEcpnmXQofS",
    "role": "inventory_manager",
    "hospital_id": "solis-hospital",
    "department": null,
    "userName": "Solis Hospital Ops Manager"
  },
  {
    "email": "STF-033-EMG-001",
    "password": "$2b$10$xuK.GBuwgoApycbOd1mnm.pWemvRWOq4srGe/1U8kgzxdy8irzSi.",
    "role": "hospital_staff",
    "hospital_id": "solis-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-033-EMG-002",
    "password": "$2b$10$yXDyMlVyVmXqis/DmrBBc..qwJ9zKiJTIBXBXAnxTwDqehxYhknSe",
    "role": "hospital_staff",
    "hospital_id": "solis-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital034@healthgrid.gh",
    "password": "$2b$10$zJt3nacgfifuXyUGltx8H.9a2jOBX3QG/ee0FcxMLiskJcSKQTgNu",
    "role": "hospital_admin",
    "hospital_id": "eden-family-hospital",
    "department": null,
    "userName": "Eden Family Hospital Admin"
  },
  {
    "email": "inventory.hospital034@healthgrid.gh",
    "password": "$2b$10$0QDDu11nwg57E05JhePv9Od/.PaazvrJi9sZm9cBwtdtMXZpKvLqe",
    "role": "inventory_manager",
    "hospital_id": "eden-family-hospital",
    "department": null,
    "userName": "Eden Family Hospital Ops Manager"
  },
  {
    "email": "STF-034-EMG-001",
    "password": "$2b$10$TpLBY1TTxH8kjBnLaQtB9OTyygRutR7DSywPXYnJMoBTw3oONOSE.",
    "role": "hospital_staff",
    "hospital_id": "eden-family-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-034-EMG-002",
    "password": "$2b$10$lZP79BRWZjhEj17ymbuAlu9s9tXAiZzFGy4I715.FlyejxIrN0hzm",
    "role": "hospital_staff",
    "hospital_id": "eden-family-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital035@healthgrid.gh",
    "password": "$2b$10$adgJTBCgZF9Agx9fKSBXzevPVXz0w065t8QsUjoIf9yM/1aa.L82e",
    "role": "hospital_admin",
    "hospital_id": "lapaz-community-hospital",
    "department": null,
    "userName": "Lapaz Community Hospital Admin"
  },
  {
    "email": "inventory.hospital035@healthgrid.gh",
    "password": "$2b$10$w.sr94x.L.gRVpOM1DEQKOr2nZ66WMAMJoGIvNT5x2FegmuPu/GSK",
    "role": "inventory_manager",
    "hospital_id": "lapaz-community-hospital",
    "department": null,
    "userName": "Lapaz Community Hospital Ops Manager"
  },
  {
    "email": "STF-035-EMG-001",
    "password": "$2b$10$IwndLKB.0HMJ/NEZd7.MFeo33mCJ11J.3OkaJ7oTuJr3RgSMvnsz2",
    "role": "hospital_staff",
    "hospital_id": "lapaz-community-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-035-EMG-002",
    "password": "$2b$10$NFo/aYplV6y/1eZlDxg8.e4UVlglYyh6AJDYKgIEd14VfQOJgYOUm",
    "role": "hospital_staff",
    "hospital_id": "lapaz-community-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-035-GEN-001",
    "password": "$2b$10$a78GtHK8pCwsa6j/zV73beuEVEQlaDjhBVlOl/WiP5eDXSIbEE6mm",
    "role": "hospital_staff",
    "hospital_id": "lapaz-community-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-035-GEN-002",
    "password": "$2b$10$Cz/aCiCQqorz03XKN./1Quc1Jusvb3dBfrcwnWKlWMV7vrlmMDocG",
    "role": "hospital_staff",
    "hospital_id": "lapaz-community-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "admin.hospital036@healthgrid.gh",
    "password": "$2b$10$ffi3cwH2ivKv3Z2e5oklQ.LpBkgNgBJuwDPQY6sHtSOwPZwe1wT4u",
    "role": "hospital_admin",
    "hospital_id": "franklyn-medical-centre",
    "department": null,
    "userName": "Franklyn Medical Centre Admin"
  },
  {
    "email": "inventory.hospital036@healthgrid.gh",
    "password": "$2b$10$zh41SkA8d9JgV.aFEndZLexY7CJoKFfJxFMgBZFuIOW/2la3iPk9i",
    "role": "inventory_manager",
    "hospital_id": "franklyn-medical-centre",
    "department": null,
    "userName": "Franklyn Medical Centre Ops Manager"
  },
  {
    "email": "STF-036-EMG-001",
    "password": "$2b$10$gxYjie/x.MTD3s0GauUtK.yllZAPVBVpHSdUpVlThh.I9YF/6Mkh.",
    "role": "hospital_staff",
    "hospital_id": "franklyn-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-036-EMG-002",
    "password": "$2b$10$LaadVJot3ljj/O1pWmnyXOZqlYjVWIS3.2J6fLlLUFdZpyBmSBU7.",
    "role": "hospital_staff",
    "hospital_id": "franklyn-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital037@healthgrid.gh",
    "password": "$2b$10$KTQKPcz.AX0Sw9mpCXzR1.mZ9i3qjVXsVrCiOCLUhQIvkEDCnNx0i",
    "role": "hospital_admin",
    "hospital_id": "new-ashongman-community-hospital",
    "department": null,
    "userName": "New Ashongman Community Hospital Admin"
  },
  {
    "email": "inventory.hospital037@healthgrid.gh",
    "password": "$2b$10$/AiUIT3ylZBzLYm10Sypc.UdQ2reCTNYpf4qYWu.Up8cRlmWoYvUm",
    "role": "inventory_manager",
    "hospital_id": "new-ashongman-community-hospital",
    "department": null,
    "userName": "New Ashongman Community Hospital Ops Manager"
  },
  {
    "email": "STF-037-EMG-001",
    "password": "$2b$10$T0W8LxmI.GcIHSeuaQI1Mu8uM7LXvQyFJi7Uv8Ccq.uZXp9SbgrNi",
    "role": "hospital_staff",
    "hospital_id": "new-ashongman-community-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-037-EMG-002",
    "password": "$2b$10$XhYv5BLpBYDsymggYsppVe5G9FAuCgdcsAsoHXK8Jy5WP680H6lHm",
    "role": "hospital_staff",
    "hospital_id": "new-ashongman-community-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital038@healthgrid.gh",
    "password": "$2b$10$Eq89EQ1pL1.1gjJEvRhew.lrPiL7mvSQ0mUlN9Ra1DmESGwj3AC1q",
    "role": "hospital_admin",
    "hospital_id": "atomic-hospital",
    "department": null,
    "userName": "Atomic Hospital Admin"
  },
  {
    "email": "inventory.hospital038@healthgrid.gh",
    "password": "$2b$10$0eGgwrwkEzDJGOtb69Wm8.t0BTddp6fpnurTRaJA3zl7eFzj2hhJO",
    "role": "inventory_manager",
    "hospital_id": "atomic-hospital",
    "department": null,
    "userName": "Atomic Hospital Ops Manager"
  },
  {
    "email": "STF-038-EMG-001",
    "password": "$2b$10$X/RIG5g/Ado.dCH2YIwM6etUpbiHoHTpdfQbSLVLtrNJMJM/k8NgW",
    "role": "hospital_staff",
    "hospital_id": "atomic-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-038-EMG-002",
    "password": "$2b$10$XlrUH1txyG.ge3VQUCt22O/Ucv.nUk.Y8NYZk1dRHVt2DrU4A2m4q",
    "role": "hospital_staff",
    "hospital_id": "atomic-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital039@healthgrid.gh",
    "password": "$2b$10$967gtW5XrOIdlruHmJfEUuALrJFDrxDvphP1z9DunEpuMMY0GUaLS",
    "role": "hospital_admin",
    "hospital_id": "vra-hospital-accra",
    "department": null,
    "userName": "VRA HOSPITAL, ACCRA Admin"
  },
  {
    "email": "inventory.hospital039@healthgrid.gh",
    "password": "$2b$10$z7SxhKAeZEFaMxkEE5/wheyy08RruuRZK8Qs6HZkVX9PEtCg5L5US",
    "role": "inventory_manager",
    "hospital_id": "vra-hospital-accra",
    "department": null,
    "userName": "VRA HOSPITAL, ACCRA Ops Manager"
  },
  {
    "email": "STF-039-EMG-001",
    "password": "$2b$10$bKtLTh6KlwC34k.0S7BEHesakAQgidO8RBIHTlVEuxJcf9qOQGL5.",
    "role": "hospital_staff",
    "hospital_id": "vra-hospital-accra",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-039-EMG-002",
    "password": "$2b$10$YUuusTkOIhNbh0hpgwWI/e6mp6iND4PWWN7C5MGVNYW07r1zxCNCm",
    "role": "hospital_staff",
    "hospital_id": "vra-hospital-accra",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital040@healthgrid.gh",
    "password": "$2b$10$NJpfQeFDpUg.2irCrV4gxuYRxVYIaqMvbZbIUc73cF4HZWTHgc3Au",
    "role": "hospital_admin",
    "hospital_id": "lucy-memorial-hospital",
    "department": null,
    "userName": "Lucy Memorial hospital Admin"
  },
  {
    "email": "inventory.hospital040@healthgrid.gh",
    "password": "$2b$10$NFhAiJLtZGp7laMG9LGrg.cY4L/33bRORLONiLAGSnw4tCBIlsxGC",
    "role": "inventory_manager",
    "hospital_id": "lucy-memorial-hospital",
    "department": null,
    "userName": "Lucy Memorial hospital Ops Manager"
  },
  {
    "email": "STF-040-EMG-001",
    "password": "$2b$10$bbW4cF2kcgQMEbMGzyOew.mNUyD0wWGtpFQajEa3IfMZ5sahs148.",
    "role": "hospital_staff",
    "hospital_id": "lucy-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-040-EMG-002",
    "password": "$2b$10$osdc681xzHZrZnSUGB4gX.9UZK/c14GX1VJG3GLUprLv2F.JsZo9i",
    "role": "hospital_staff",
    "hospital_id": "lucy-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital041@healthgrid.gh",
    "password": "$2b$10$gkfAEiMxIXhxHNuEfYaWJuS43cgiJSL33pwF62OgTHxB9BRN0f0Ji",
    "role": "hospital_admin",
    "hospital_id": "yeboah-hospital",
    "department": null,
    "userName": "Yeboah Hospital Admin"
  },
  {
    "email": "inventory.hospital041@healthgrid.gh",
    "password": "$2b$10$0IxaI5VcetS7qmtMWMrSze5fU8r270lKwV9UJTqRrUrGPNmLym9S6",
    "role": "inventory_manager",
    "hospital_id": "yeboah-hospital",
    "department": null,
    "userName": "Yeboah Hospital Ops Manager"
  },
  {
    "email": "STF-041-EMG-001",
    "password": "$2b$10$JPaD2BPhMIGWcjZEsftuv.vSqJQK3vr3Jwp/g3vuKXvSfMiXMkxK2",
    "role": "hospital_staff",
    "hospital_id": "yeboah-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-041-EMG-002",
    "password": "$2b$10$H6zzKUMrFugkhrfN9JuIg.tHCTfYuA7w0u9Rp6bPKr46Zy63IsiLC",
    "role": "hospital_staff",
    "hospital_id": "yeboah-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital042@healthgrid.gh",
    "password": "$2b$10$LWq0Fcm8nym8xDf5BqszzezBtLR1KQhSDA5o/cDCMtoTHZ0Ha0Qg.",
    "role": "hospital_admin",
    "hospital_id": "emmanuel-community-hospital",
    "department": null,
    "userName": "Emmanuel Community Hospital Admin"
  },
  {
    "email": "inventory.hospital042@healthgrid.gh",
    "password": "$2b$10$22VSC466XZltdIB7Qkve4uH7qTxwI3Hb1FjMJnsyggd9ypeivTfuS",
    "role": "inventory_manager",
    "hospital_id": "emmanuel-community-hospital",
    "department": null,
    "userName": "Emmanuel Community Hospital Ops Manager"
  },
  {
    "email": "STF-042-EMG-001",
    "password": "$2b$10$PVK7gl09qlC0f/N68sjVT.uzM9dIjr1uh4lS65iZltzE6IMTO2hR.",
    "role": "hospital_staff",
    "hospital_id": "emmanuel-community-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-042-EMG-002",
    "password": "$2b$10$nshqeMZYSiLcglTI15GS.e3fN8IBS1DThouND3619OchudLENycyO",
    "role": "hospital_staff",
    "hospital_id": "emmanuel-community-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital043@healthgrid.gh",
    "password": "$2b$10$K22yVNNzDYFHInrReuahU.y2uDhQ2kCB/qpWBPS5gv1HumJ4S8XmC",
    "role": "hospital_admin",
    "hospital_id": "otobia-memorial-hospital",
    "department": null,
    "userName": "Otobia Memorial Hospital Admin"
  },
  {
    "email": "inventory.hospital043@healthgrid.gh",
    "password": "$2b$10$5Iz532K58.qFSusmFpnbse3kfQihzJQgeI1ZD51b0TUU9qAWZERjC",
    "role": "inventory_manager",
    "hospital_id": "otobia-memorial-hospital",
    "department": null,
    "userName": "Otobia Memorial Hospital Ops Manager"
  },
  {
    "email": "STF-043-EMG-001",
    "password": "$2b$10$LUBbZ2Iy4.gzvvsz0AunNu/j/7Navkimok7FmgO05vjhqIZaCQS7O",
    "role": "hospital_staff",
    "hospital_id": "otobia-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-043-EMG-002",
    "password": "$2b$10$Jh7gfvj04.VUucLSq062LuYTj3BZS9aDKknTfFQPxe8mo6V0zesem",
    "role": "hospital_staff",
    "hospital_id": "otobia-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital044@healthgrid.gh",
    "password": "$2b$10$.L2GDSsFyR2lpTXhmBt4GuxwGXffhUcKxp35pcIif2qz8GWDrRKCq",
    "role": "hospital_admin",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": null,
    "userName": "Trust Specialist Hospital, Osu Admin"
  },
  {
    "email": "inventory.hospital044@healthgrid.gh",
    "password": "$2b$10$JOF/X.W/DujZyOo3NmV2J.RMSBOv5uJ16jUfwSjr0HpqYDToMOg2e",
    "role": "inventory_manager",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": null,
    "userName": "Trust Specialist Hospital, Osu Ops Manager"
  },
  {
    "email": "STF-044-EMG-001",
    "password": "$2b$10$vjnhirjJQHZOQRrrGwcRkOPo.1hbkVs83uRaOdK5BxIP2d1Omuji6",
    "role": "hospital_staff",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-044-EMG-002",
    "password": "$2b$10$6WGez5hQpcvYjkLdRBTlhuMU.6h1J7Zjj64GYApRStDmg64TnWGDq",
    "role": "hospital_staff",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-044-SUR-001",
    "password": "$2b$10$9g6SbKy4/jIKYflUFNa2xeTyLurqH1DkU80MAz9oVoiFWVRf74Vs6",
    "role": "hospital_staff",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-044-SUR-002",
    "password": "$2b$10$F5Ztmjd7ZlbQFjj4uMFv0evZkGLNYUYWJRuNRruH2nFglOX8gAbPK",
    "role": "hospital_staff",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "STF-044-ICU-001",
    "password": "$2b$10$lZ8ysD4jNP9Bs6aJV7TCH.RPwYvZzAK7T50Sh4UnzmCKik6kDrNgW",
    "role": "hospital_staff",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": "ICU",
    "userName": "ICU Nurse 1"
  },
  {
    "email": "STF-044-ICU-002",
    "password": "$2b$10$BtRVhV7QWw/9JKyJ3iUFQuWXMmjz6.8dw6wK6jz17o1knGg8UnlVK",
    "role": "hospital_staff",
    "hospital_id": "trust-specialist-hospital-osu",
    "department": "ICU",
    "userName": "ICU Nurse 2"
  },
  {
    "email": "admin.hospital045@healthgrid.gh",
    "password": "$2b$10$4ImkCWwc7.nWc/2zqTYZbuXBY/IUDfMMsHG5DOrRVFSMM832DDRRq",
    "role": "hospital_admin",
    "hospital_id": "barnor-memorial-hospital",
    "department": null,
    "userName": "Barnor Memorial Hospital Admin"
  },
  {
    "email": "inventory.hospital045@healthgrid.gh",
    "password": "$2b$10$q6GRSRzk4UJfXoyieAKtbecYi2NYQ1lk9ZeuZhxnlU9Pa/TZitjqa",
    "role": "inventory_manager",
    "hospital_id": "barnor-memorial-hospital",
    "department": null,
    "userName": "Barnor Memorial Hospital Ops Manager"
  },
  {
    "email": "STF-045-EMG-001",
    "password": "$2b$10$r0TJo9bBySV9IparxBfld.XLb2fkS4qufXQw9RbbgjbVqLB.fMxBW",
    "role": "hospital_staff",
    "hospital_id": "barnor-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-045-EMG-002",
    "password": "$2b$10$RYZVqfVGHhVn81pzzTQoTurGJJq1Bady/yqj/vrgYdQBqWrrdrrdG",
    "role": "hospital_staff",
    "hospital_id": "barnor-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital046@healthgrid.gh",
    "password": "$2b$10$RtX5eIW1wU.6.P2Lq7FtSu6bGwEULCjgsGmHuQNzSVmQAIOd3.Ah2",
    "role": "hospital_admin",
    "hospital_id": "twumasiwaa-hospital",
    "department": null,
    "userName": "Twumasiwaa Hospital Admin"
  },
  {
    "email": "inventory.hospital046@healthgrid.gh",
    "password": "$2b$10$vOLeQXzl.2SMphhjbaUC7OpuTE2xwCJGbl1IqgYItL028hWTaAdTC",
    "role": "inventory_manager",
    "hospital_id": "twumasiwaa-hospital",
    "department": null,
    "userName": "Twumasiwaa Hospital Ops Manager"
  },
  {
    "email": "STF-046-EMG-001",
    "password": "$2b$10$L.SyT3aZ1q.DlTyhLgh46eTdwEmoO6gCL2JN1Q924YqZrd20Sb8oe",
    "role": "hospital_staff",
    "hospital_id": "twumasiwaa-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-046-EMG-002",
    "password": "$2b$10$pcxgh9c9XZ.G4EhHbtHbpuLPRSFIh2WsT5zLlNhDWbK/9K7qrM6x2",
    "role": "hospital_staff",
    "hospital_id": "twumasiwaa-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital047@healthgrid.gh",
    "password": "$2b$10$CG/tJLEVwb8t2kBX74zaquVqGO/i3tJDEPfPAaW/bLF/4rvua.rW2",
    "role": "hospital_admin",
    "hospital_id": "inkoom-hospital",
    "department": null,
    "userName": "Inkoom Hospital Admin"
  },
  {
    "email": "inventory.hospital047@healthgrid.gh",
    "password": "$2b$10$32HeslXpGUaFYtjN5aVRkunkf0wcycwar4/9OD5JTo8QKSanEZX8S",
    "role": "inventory_manager",
    "hospital_id": "inkoom-hospital",
    "department": null,
    "userName": "Inkoom Hospital Ops Manager"
  },
  {
    "email": "STF-047-EMG-001",
    "password": "$2b$10$SV7teGEFzupd1GMlcdHxO.9gVJaIg/co8GIbIlyD3ALtQi6h0yzgq",
    "role": "hospital_staff",
    "hospital_id": "inkoom-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-047-EMG-002",
    "password": "$2b$10$9/IJZEo.NwQVh8B7Emw15OEz6SyemEhuH0g4xD2oh4XWKLwjNDHWa",
    "role": "hospital_staff",
    "hospital_id": "inkoom-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital048@healthgrid.gh",
    "password": "$2b$10$VtvXdRlsHJyDYLLAvQDlvOPSv9WuVzPaSD1y/Qsmi2wns1ocKzZhC",
    "role": "hospital_admin",
    "hospital_id": "commonwealth-aid-clinic",
    "department": null,
    "userName": "COMMONWEALTH AID CLINIC Admin"
  },
  {
    "email": "inventory.hospital048@healthgrid.gh",
    "password": "$2b$10$ri86VkO/NkUYXaHf285tZ.I70mLVHah4c41.MW/Pwdr2jXjI7Vf.y",
    "role": "inventory_manager",
    "hospital_id": "commonwealth-aid-clinic",
    "department": null,
    "userName": "COMMONWEALTH AID CLINIC Ops Manager"
  },
  {
    "email": "STF-048-EMG-001",
    "password": "$2b$10$AayIFz19Ct0VWs93qwfXUOdB7f4FJYnWF1j4t9Ayk.3V1iFmUBJx6",
    "role": "hospital_staff",
    "hospital_id": "commonwealth-aid-clinic",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-048-EMG-002",
    "password": "$2b$10$xdgWTIRoKLQ90KgWp2SAvepwoJviwkL2/gqJ8OuRpOQU733XIAZnu",
    "role": "hospital_staff",
    "hospital_id": "commonwealth-aid-clinic",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital049@healthgrid.gh",
    "password": "$2b$10$4pxbUTaqP6jNSBfPEA0n2O0eJtPFdsHA3V/Jf0t7ONktZkL6cOIWi",
    "role": "hospital_admin",
    "hospital_id": "esidem-hospital",
    "department": null,
    "userName": "Esidem Hospital Admin"
  },
  {
    "email": "inventory.hospital049@healthgrid.gh",
    "password": "$2b$10$vG/j9oXVLWEUyYPAdOjMzOaItHCDpRY7Y5otpfuniU1KCk6rVvnuy",
    "role": "inventory_manager",
    "hospital_id": "esidem-hospital",
    "department": null,
    "userName": "Esidem Hospital Ops Manager"
  },
  {
    "email": "STF-049-EMG-001",
    "password": "$2b$10$aKZ8M54QbuSI1WidqG8zN.Pm4NBfQ/6OI8pPdNpDk5wFs7AAzGVqq",
    "role": "hospital_staff",
    "hospital_id": "esidem-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-049-EMG-002",
    "password": "$2b$10$JHai4ArgP0tlowRFnWKDOuDnaRLb1dcDxNq.TwhL4yPNXy.uqZDXC",
    "role": "hospital_staff",
    "hospital_id": "esidem-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital050@healthgrid.gh",
    "password": "$2b$10$.CWHrns5tCJwmt0md7Z3/OiCVsLJ1Rmt0y6c4b3/ch9S9PxIMBwiy",
    "role": "hospital_admin",
    "hospital_id": "ga-north-municipal-hospital",
    "department": null,
    "userName": "Ga North Municipal Hospital Admin"
  },
  {
    "email": "inventory.hospital050@healthgrid.gh",
    "password": "$2b$10$GAoMoWxT5Pk9jihLGJZ48eYZXHPQwcFi70HjurQfpzc.E6RT49hku",
    "role": "inventory_manager",
    "hospital_id": "ga-north-municipal-hospital",
    "department": null,
    "userName": "Ga North Municipal Hospital Ops Manager"
  },
  {
    "email": "STF-050-EMG-001",
    "password": "$2b$10$Xz27UaUwdUNQ7rkTfutAee7MExlkkIFP7i0j0wawuWo2ffuy/F01e",
    "role": "hospital_staff",
    "hospital_id": "ga-north-municipal-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-050-EMG-002",
    "password": "$2b$10$LO.IgYNLox8v3NOvjC20e.3f41cBKswUiQl7OyKyKDr2XcIOSxwTO",
    "role": "hospital_staff",
    "hospital_id": "ga-north-municipal-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital051@healthgrid.gh",
    "password": "$2b$10$xhyqGjgPVio6lHKNT3M06eFA.TNMgMKDzzvwxe0DVPl9divH.jS/S",
    "role": "hospital_admin",
    "hospital_id": "lister-hospital-and-fertility-centre",
    "department": null,
    "userName": "Lister Hospital And Fertility Centre Admin"
  },
  {
    "email": "inventory.hospital051@healthgrid.gh",
    "password": "$2b$10$m5uZFTpD3neBiiVc3ldXG.XmdUV8DqJjbL/buWhOunAK1O6fNriHa",
    "role": "inventory_manager",
    "hospital_id": "lister-hospital-and-fertility-centre",
    "department": null,
    "userName": "Lister Hospital And Fertility Centre Ops Manager"
  },
  {
    "email": "STF-051-EMG-001",
    "password": "$2b$10$5Ls9Loa5i8/8qCOh3AZ.KezmrQOYyCiv7q4wHAhTX4iBVmwW/feg6",
    "role": "hospital_staff",
    "hospital_id": "lister-hospital-and-fertility-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-051-EMG-002",
    "password": "$2b$10$hHB4Vo5Tu7ivYizR35.4J.6WruQ7aNU9/sDpy5NlJ/owR9hooMN/.",
    "role": "hospital_staff",
    "hospital_id": "lister-hospital-and-fertility-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-051-MAT-001",
    "password": "$2b$10$GGJGHX.5bfm8U2DulexMZe9bFEmH/xVxhDMyKRXqnoE/kBCkMZFDe",
    "role": "hospital_staff",
    "hospital_id": "lister-hospital-and-fertility-centre",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-051-MAT-002",
    "password": "$2b$10$ZPfb8Iwm5EujttfHdOxnx.i5ERWAFM3S9PpfsXyLxixNH76YYij.S",
    "role": "hospital_staff",
    "hospital_id": "lister-hospital-and-fertility-centre",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "admin.hospital052@healthgrid.gh",
    "password": "$2b$10$eXs1T7nYZEQJRcusDU9A2u3yM69he7zCSNxYZwBWeNBTJMms0a2E6",
    "role": "hospital_admin",
    "hospital_id": "ghana-canada-medical-centre",
    "department": null,
    "userName": "Ghana-Canada Medical Centre Admin"
  },
  {
    "email": "inventory.hospital052@healthgrid.gh",
    "password": "$2b$10$SEZ.mudlDi4Cs4IxAwuAN.2fzQ3xJrbB9GdbsX5AyV9VYxHHualii",
    "role": "inventory_manager",
    "hospital_id": "ghana-canada-medical-centre",
    "department": null,
    "userName": "Ghana-Canada Medical Centre Ops Manager"
  },
  {
    "email": "STF-052-EMG-001",
    "password": "$2b$10$6hl18/vH6.hFeijS23U1CeAxzsfpZSKS1VUDF38HTqD4GIcnNbRNK",
    "role": "hospital_staff",
    "hospital_id": "ghana-canada-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-052-EMG-002",
    "password": "$2b$10$A99b.PWPkINtbge6HDGrzeZnBPFHzZaxWps7q/6.kM7Xd4QWK3/qa",
    "role": "hospital_staff",
    "hospital_id": "ghana-canada-medical-centre",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital053@healthgrid.gh",
    "password": "$2b$10$cDy.5pzHKtvpQ0qc7uC8Y.sdS.ZhMRfVUKNyzdKXWSR/wly2gULe6",
    "role": "hospital_admin",
    "hospital_id": "pentecost-hospital-madina",
    "department": null,
    "userName": "Pentecost Hospital, Madina Admin"
  },
  {
    "email": "inventory.hospital053@healthgrid.gh",
    "password": "$2b$10$v36MnIRrdxIXi5KqoJefv.E2whQuwK7NZV1OQHhR8xAXPwVa0CXgC",
    "role": "inventory_manager",
    "hospital_id": "pentecost-hospital-madina",
    "department": null,
    "userName": "Pentecost Hospital, Madina Ops Manager"
  },
  {
    "email": "STF-053-EMG-001",
    "password": "$2b$10$TD8KMaT1N4Uxveb9lXt5.O0DNxwlBOwQCuJKphES1mYop3W02irxC",
    "role": "hospital_staff",
    "hospital_id": "pentecost-hospital-madina",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-053-EMG-002",
    "password": "$2b$10$aIn/VynjBGC33kr5S.zleuZuSz7KkMcjrq.jGu49pmgwv/lTqgKnG",
    "role": "hospital_staff",
    "hospital_id": "pentecost-hospital-madina",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-053-GEN-001",
    "password": "$2b$10$YYZogjQ91cHr0hBpLWLG1uauZVsSw2XCSz65xnY7zBfvB/z0T8EQe",
    "role": "hospital_staff",
    "hospital_id": "pentecost-hospital-madina",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-053-GEN-002",
    "password": "$2b$10$RWuMjStxM/RntVXCg/uuvO6HWBw1CgnQexrVA/z2uXW5t1vlge12K",
    "role": "hospital_staff",
    "hospital_id": "pentecost-hospital-madina",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "STF-053-MAT-001",
    "password": "$2b$10$mejsZ9LL.wFHUrxyu8xZEe0Fi3meHIlAoCiZTssPonc4q0z5j5ega",
    "role": "hospital_staff",
    "hospital_id": "pentecost-hospital-madina",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-053-MAT-002",
    "password": "$2b$10$lhcwC5Wn98LUppufCcDliueNs7CKiGC5IGt1qIrm6MxEIH.sGE0xW",
    "role": "hospital_staff",
    "hospital_id": "pentecost-hospital-madina",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "admin.hospital054@healthgrid.gh",
    "password": "$2b$10$0cpwAaA1je2MGYjPZ3fskOHfqPl8B8rPuRAfgaPAEcnbV2l/pniQC",
    "role": "hospital_admin",
    "hospital_id": "anthon-memorial-hospital",
    "department": null,
    "userName": "Anthon Memorial Hospital Admin"
  },
  {
    "email": "inventory.hospital054@healthgrid.gh",
    "password": "$2b$10$mW5WbdNQoMmFLUAw9tY9lukQ35yKEl15tNwSeulBmpfXMSLuSG4c2",
    "role": "inventory_manager",
    "hospital_id": "anthon-memorial-hospital",
    "department": null,
    "userName": "Anthon Memorial Hospital Ops Manager"
  },
  {
    "email": "STF-054-EMG-001",
    "password": "$2b$10$nWgJLriBSKpNcDLJR6Zz7.RsJLyCvmYoFUbMFB8npxAZup.Rm.wZi",
    "role": "hospital_staff",
    "hospital_id": "anthon-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-054-EMG-002",
    "password": "$2b$10$x8qc3QoBgIfgj6CNnploa.1IQADbbQQELvYfmlU0agp8UFnXytINa",
    "role": "hospital_staff",
    "hospital_id": "anthon-memorial-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital055@healthgrid.gh",
    "password": "$2b$10$gyahRsyXNL45HSwtVMo.JuZaJQUunKayjJ.GAkNK9u244mRq80gHS",
    "role": "hospital_admin",
    "hospital_id": "del-international-hospital",
    "department": null,
    "userName": "DEL International Hospital Admin"
  },
  {
    "email": "inventory.hospital055@healthgrid.gh",
    "password": "$2b$10$kTiN3FQkQM6sOR7k4iXSHOYx8bxtx4BUR5PwW6JMSL644zJUcaj9a",
    "role": "inventory_manager",
    "hospital_id": "del-international-hospital",
    "department": null,
    "userName": "DEL International Hospital Ops Manager"
  },
  {
    "email": "STF-055-EMG-001",
    "password": "$2b$10$q33B.jeHzh7.CMCoHfwxauqPj74H5YAbGqipeYhHmVsDeOzN8UyqW",
    "role": "hospital_staff",
    "hospital_id": "del-international-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-055-EMG-002",
    "password": "$2b$10$1w0VG3rXOT2xAL2yYFEQgOg1dZjhK3SWdyLhZPq6XmSczWfPLLpy2",
    "role": "hospital_staff",
    "hospital_id": "del-international-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-055-PAE-001",
    "password": "$2b$10$RkQubBuMytik.g2bCq2IheP9.TPKzAwX9EHjKXPfNdioJyknK.4T.",
    "role": "hospital_staff",
    "hospital_id": "del-international-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 1"
  },
  {
    "email": "STF-055-PAE-002",
    "password": "$2b$10$bh.IOLhLYMh9s4QMbh4vnuFgRHsyHDUkF8PXIZn5dlAIAEc15uGT.",
    "role": "hospital_staff",
    "hospital_id": "del-international-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 2"
  },
  {
    "email": "admin.hospital056@healthgrid.gh",
    "password": "$2b$10$eX8R9R4307CkGjuzHD2bh.uhPbfx.95Fq7C4FTtE3ypBwDFhSD1F6",
    "role": "hospital_admin",
    "hospital_id": "healthlink-hospital",
    "department": null,
    "userName": "HealthLink Hospital Admin"
  },
  {
    "email": "inventory.hospital056@healthgrid.gh",
    "password": "$2b$10$krQDdYJ0n7LiNY3E7YEEv.tNbkh8ZzuXf7GlYnoygVhTbk/Ow.5Zy",
    "role": "inventory_manager",
    "hospital_id": "healthlink-hospital",
    "department": null,
    "userName": "HealthLink Hospital Ops Manager"
  },
  {
    "email": "STF-056-EMG-001",
    "password": "$2b$10$rCSKv2ALqWrw6TLxwIfQf.WTShMfin8xn4smPDQu3D6TF9/71AkUu",
    "role": "hospital_staff",
    "hospital_id": "healthlink-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-056-EMG-002",
    "password": "$2b$10$cPyzp2KfZgcaJtzNthHLl.6vVE1o5aCnxLJFytax42mrUlg6wDXFC",
    "role": "hospital_staff",
    "hospital_id": "healthlink-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "admin.hospital057@healthgrid.gh",
    "password": "$2b$10$dxpXeizHdDFMVYhHsEEl6OcPJcRyh.ajTcjDAL6BBYc2wUr24zxNC",
    "role": "hospital_admin",
    "hospital_id": "luccahealth-medical-center",
    "department": null,
    "userName": "LuccaHealth Medical Center Admin"
  },
  {
    "email": "inventory.hospital057@healthgrid.gh",
    "password": "$2b$10$JBmRoH/OIqkqWBfuRddex.HPqHZ3B99mOlqKD3oVTAzOhM2TTlxz6",
    "role": "inventory_manager",
    "hospital_id": "luccahealth-medical-center",
    "department": null,
    "userName": "LuccaHealth Medical Center Ops Manager"
  },
  {
    "email": "STF-057-EMG-001",
    "password": "$2b$10$BpLW0hY5vynrCGlVUTYbz..88fTS1YPf6WOdLDs5jQX6t5tU4a562",
    "role": "hospital_staff",
    "hospital_id": "luccahealth-medical-center",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-057-EMG-002",
    "password": "$2b$10$12SjkQZ4SIx71hEsqWcxGuxi7MMQFLgPJyK6zvlht4QvjrnCVAlOe",
    "role": "hospital_staff",
    "hospital_id": "luccahealth-medical-center",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-057-SUR-001",
    "password": "$2b$10$YO4G8MA0i0AWubuxYgDY/ecm/DfZtVgunkyFItHdb77yUl67lHGpS",
    "role": "hospital_staff",
    "hospital_id": "luccahealth-medical-center",
    "department": "Surgical",
    "userName": "Surgical Nurse 1"
  },
  {
    "email": "STF-057-SUR-002",
    "password": "$2b$10$lvF0NqsyHwLWeOm/KXR3.eW6UALVtMU5lWZI7MN.91hC.BCmnuSN6",
    "role": "hospital_staff",
    "hospital_id": "luccahealth-medical-center",
    "department": "Surgical",
    "userName": "Surgical Nurse 2"
  },
  {
    "email": "admin.hospital058@healthgrid.gh",
    "password": "$2b$10$N6/J0HaXnbGBeBK2RGi7KOogwNAfaBD8tY8kYhFkZ4vXEzhIfjwRW",
    "role": "hospital_admin",
    "hospital_id": "lekma-hospital",
    "department": null,
    "userName": "LEKMA Hospital Admin"
  },
  {
    "email": "inventory.hospital058@healthgrid.gh",
    "password": "$2b$10$jTWj98zkjkjnmq.cZ1MvcevN9DGJe7qQqwPIrHuws7HwGJIv0PZp6",
    "role": "inventory_manager",
    "hospital_id": "lekma-hospital",
    "department": null,
    "userName": "LEKMA Hospital Ops Manager"
  },
  {
    "email": "STF-058-EMG-001",
    "password": "$2b$10$H8GTfdazD85ZnBq6mMiBJ.tjah0rvHy6NavKopKiXDb5mEVRicatW",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-058-EMG-002",
    "password": "$2b$10$Wpx0EJnVloJTPpSe9H3r.OTr4J.dlJ3DclTlIC24b3aZobIw/ucki",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  },
  {
    "email": "STF-058-GEN-001",
    "password": "$2b$10$bjjlFLS0gWam1mNbBuWTwO27H566dpab/2TpLbeXGO7mMRkit63yW",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "General",
    "userName": "General Nurse 1"
  },
  {
    "email": "STF-058-GEN-002",
    "password": "$2b$10$A9BVIjoiUcFSVuIyO.igt.0ICciVgAT7Nye4rsiVTgmVY33Divko6",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "General",
    "userName": "General Nurse 2"
  },
  {
    "email": "STF-058-MAT-001",
    "password": "$2b$10$7p9pSTJRWdIGURQxo9GVqu/4zDdVA55iXtCFMx.W0zlXyvRMzVnOG",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 1"
  },
  {
    "email": "STF-058-MAT-002",
    "password": "$2b$10$XCQNHwOEy.PxrCSZBpDq6urOx7SFtFqiWxxdhiD6DFmo4j3l1kwgO",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "Maternity",
    "userName": "Maternity Nurse 2"
  },
  {
    "email": "STF-058-PAE-001",
    "password": "$2b$10$4lTzs1YVmUpfWfKwY5JiB.cuHmbXMlXVeP5PO9rHzOn1fFu3LPvVK",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 1"
  },
  {
    "email": "STF-058-PAE-002",
    "password": "$2b$10$lL2YWQMxoFjd0L85MFJ5OuebETeBU9aWOZ0obfKTIHmK7nS7slGDi",
    "role": "hospital_staff",
    "hospital_id": "lekma-hospital",
    "department": "Paediatric",
    "userName": "Paediatric Nurse 2"
  },
  {
    "email": "admin.hospital059@healthgrid.gh",
    "password": "$2b$10$IGztO8Q/8Igt.PPln2w/9..mkXYA5KXaBHGGu.KztwEE6b5hA7GEG",
    "role": "hospital_admin",
    "hospital_id": "first-american-specialist-medical-center-accra",
    "department": null,
    "userName": "First American Specialist Medical Center, Accra Admin"
  },
  {
    "email": "inventory.hospital059@healthgrid.gh",
    "password": "$2b$10$1XGx20bKuxujatrhzcs5MeVo1b8iI5OiyozMAhD./8kUgFVe5H6S.",
    "role": "inventory_manager",
    "hospital_id": "first-american-specialist-medical-center-accra",
    "department": null,
    "userName": "First American Specialist Medical Center, Accra Ops Manager"
  },
  {
    "email": "STF-059-EMG-001",
    "password": "$2b$10$WuWFb01nevo3Dn28EjLrBO7XLIBu9JflMej4bUxNJemKylMhLrn/.",
    "role": "hospital_staff",
    "hospital_id": "first-american-specialist-medical-center-accra",
    "department": "Emergency",
    "userName": "Emergency Nurse 1"
  },
  {
    "email": "STF-059-EMG-002",
    "password": "$2b$10$rF9m8XrD71USYfM18mgwOOhLdiENfBHEFPYwgl0vi.s6mZQgDfC3e",
    "role": "hospital_staff",
    "hospital_id": "first-american-specialist-medical-center-accra",
    "department": "Emergency",
    "userName": "Emergency Nurse 2"
  }
]
};

export const mockFetch = (url, options) => { return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }); };