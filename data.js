/*
	{
		id: "",
		diamond: {
			id: "",
			video: "",
			image: "",
			price: 0,
			certificate: {
				id: "",
				lab: "",
				labgrown: false,
				shape: "",
				cut: "",
				carats: 0,
				clarity: "",
				color: ""
			}
		}
	},
*/

const sampleItems = [
	{
		id: "c1c9bbf8-989a-4216-8c21-e82199e34000",
		diamond: {
			id: "c1c9bbf8-989a-4216-8c21-e82199e34000",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9ob25leWV4cG9ydC5pbi9TdG9yYWdlL3d3dy92aWV3ZXIzL1Zpc2lvbjM2MC5odG1sPz9kPVI0MA==",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9ob25leWV4cG9ydC5pbi9TdG9yYWdlL3d3dy92aWV3ZXIzL1Zpc2lvbjM2MC5odG1sPz9kPVI0MA==/0.webp",
			certificate: {
				id: "",
				lab: "IGI",
				labgrown: false,
				shape: "ROUND",
				cut: "EX",
				carats: 0.39,
				clarity: "SI2",
				color: "L"
			}
		},
		price: 261
	},
	{
		id: "73d05315-fead-47de-865d-06d93838f2e5",
		diamond: {
			id: "73d05315-fead-47de-865d-06d93838f2e5",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9uaXZvZGEtaW5ob3VzZW1lZGlhLnMzLmFtYXpvbmF3cy5jb20vaW5ob3VzZS0zNjAtNzEzNTA0MTAx",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9uaXZvZGEtaW5ob3VzZW1lZGlhLnMzLmFtYXpvbmF3cy5jb20vaW5ob3VzZS0zNjAtNzEzNTA0MTAx/251.webp",
			certificate: {
				id: "",
				lab: "IGI",
				labgrown: false,
				shape: "PEAR",
				cut: "VG",
				carats: 0.30,
				clarity: "SI1",
				color: "M"
			}
		},
		price: 261
	},
  {
		id: "795f8512-4e46-42d1-bb40-6481701d3240",
		diamond: {
			id: "795f8512-4e46-42d1-bb40-6481701d3240",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly92aWV3LmdlbTM2MC5pbi9nZW0zNjAuaHRtbD9kPTI4MDYyNTExNTctNTAzOC00MzI=",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly92aWV3LmdlbTM2MC5pbi9nZW0zNjAuaHRtbD9kPTI4MDYyNTExNTctNTAzOC00MzI=/1.webp",
			certificate: {
				id: "",
				lab: "GIA",
				labgrown: false,
				shape: "ROUND",
				cut: "VG",
				carats: 0.18,
				clarity: "SI2",
				color: "I"
			}
		},
	price: 261
	},
	{
		id: "a2126346-2df2-4d5b-94c9-de9807106d52",
		diamond: {
			id: "a2126346-2df2-4d5b-94c9-de9807106d52",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjktMjIzLUI=",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjktMjIzLUI=/248.webp",
			certificate: {
				id: "",
				lab: "",
				labgrown: false,
				shape: "MARQUISE",
				cut: "VG",
				carats: 0.19,
				clarity: "SI1",
				color: "F"
			}
		},
		price: 261
	},
  {
		id: "175a7d82-4ccf-446d-bbb4-d99144716eff",
		diamond: {
			id: "175a7d82-4ccf-446d-bbb4-d99144716eff",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjAtNzctQg==",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjAtNzctQg==/250.webp",
			certificate: {
				id: "",
				lab: "GIA",
				labgrown: false,
				shape: "PEAR",
				cut: null,
				carats: 0.18,
				clarity: "VS2",
				color: "E"
			}
		},
		price: 261
	},
  {
		id: "ae5e477f-a2bd-405b-b2e3-9128decbf9a7",
		diamond: {
			id: "ae5e477f-a2bd-405b-b2e3-9128decbf9a7",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0xMTI1NS04NzY=",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0xMTI1NS04NzY=/251.webp",
			certificate: {
				id: "",
				lab: "GIA",
				labgrown: false,
				shape: "ROUND",
				cut: "EX",
				carats: 0.18,
				clarity: "SI1",
				color: "F"
			}
		},
		price: 261
	},
  {
		id: "b92f3619-928e-4afc-9957-a1e99d80d09a",
		diamond: {
			id: "b92f3619-928e-4afc-9957-a1e99d80d09a",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjMtMjA5LUI=",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjMtMjA5LUI=/249.webp",
			certificate: {
				id: "",
				lab: "IGI",
				labgrown: false,
				shape: "EMERALD",
				cut: "VG",
				carats: 0.18,
				clarity: "VS1",
				color: "D"
			}
		},
		price: 261
	},
	{
		id: "c0841466-2a36-4056-b1cc-3f48684efa76",
		diamond: {
			id: "",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjMtMjk4LUI=",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9zbmxpdmUuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RpbS9oZDQvVmlzaW9uMzYwLmh0bWw/ZD0zMjMtMjk4LUI=/244.webp",
			certificate: {
				id: "",
				lab: "IGI",
				labgrown: false,
				shape: "EMERALD",
				cut: "VG",
				carats: 0.18,
				clarity: "VS1",
				color: "D"
			}
		},
		price: 261
	},
  {
		id: "365c1fad-e98b-415c-95ea-5f095df4024c",
		diamond: {
			id: "365c1fad-e98b-415c-95ea-5f095df4024c",
			video: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9uaXZvZGEtaW5ob3VzZW1lZGlhLnMzLmFtYXpvbmF3cy5jb20vaW5ob3VzZS0zNjAtNjUxMTY1MTUxMQ==",
			image: "https://d2rlicyi7sudqr.cloudfront.net/aHR0cHM6Ly9uaXZvZGEtaW5ob3VzZW1lZGlhLnMzLmFtYXpvbmF3cy5jb20vaW5ob3VzZS0zNjAtNjUxMTY1MTUxMQ==/254.webp",
			certificate: {
				id: "",
				lab: "GIA",
				labgrown: false,
				shape: "PEAR",
				cut: null,
				carats: 0.19,
				clarity: "VVS2",
				color: "J"
			}
		},
		price: 261
	},
];

export default sampleItems;
