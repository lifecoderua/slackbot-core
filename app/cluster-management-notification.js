module.exports = [
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "== Cluster Shutdown is Planned ==\nYour cluster **replicantsinc-01.nebula-video** is planned for shutdown in 30 minutes.\nIf you need it please Snooze this notification."
		}
	},
	{
		"type": "divider"
	},
	{
		"type": "actions",
		"elements": [
			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Delete",
					"emoji": true
				},
				"value": "[ClusterManager]PreventNotifications"
			},

      {
        "type": "static_select",
				"placeholder": {
          "type": "plain_text",
          "text": "Snooze"
        },
        "options": [
            {
                "text": {
                    "type": "plain_text",
                    "text": "1 Hour"
                },
                "value": "value-0"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "3 Hours"
                },
                "value": "value-1"
            },
            {
                "text": {
                    "type": "plain_text",
                    "text": "Tomorrow at 6 PM"
                },
                "value": "value-2"
            }
        ]
			},

			{
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Manage Clusters",
					"emoji": true
				},
				"value": "[ClusterManager]ConfigDone"
			},
		]
	},
]