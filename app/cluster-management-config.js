module.exports = [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "== Cluster Configuration ==\nNo cluster config found for your team. Please set it up!"
		}
	},
	{
		"type": "divider"
	},
	{
		"type": "actions",
		"elements": [
      {
        "type": "static_select",
				"placeholder": {
          "type": "plain_text",
          "text": "Select an item"
        },
        "options": [
            {
                "text": {
                    "type": "plain_text",
                    "text": "replicantsinc-01"
                },
                "value": "value-0"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "hkv-white"
                },
                "value": "value-1"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "hkv-silver"
                },
                "value": "value-2"
            }
        ]
			},

			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Test",
					"emoji": true
				},
				"value": "[ClusterManager]ConfigDone"
			},
		]
	},
]