function PerformAsyncRequest(url, content, onResponse)
{
	var request = new XMLHttpRequest();

	request.onreadystatechange =
		function ()
		{
			if (request.readyState == 4 /* DONE */)
			{
				var jsonData;

				if (request.status >= 400)
					jsonData = { Error: "Error from server: " + request.status + " - " + request.statusText };
				else
				{
					try
					{
						console.log('[A] raw response: ' + request.responseText);
						jsonData = JSON.parse(request.responseText, DateReviver);
					}
					catch (error)
					{
						console.log('[A] Error details:');
						console.log('[A] ' + JSON.stringify(error));

						jsonData = { Error: JSON.stringify(error) };
					}
				}

				onResponse(jsonData);
			}
		};

	if (content == null)
	{
		request.open("GET", url, true);
		request.send();
	}
	else
	{
		request.open("POST", url, true);
		request.setRequestHeader("Content-Type", "text/json; charset=utf-8");
		request.setRequestHeader("Accept", "text/json");
		request.send(JSON.stringify(content));
	}

	return request;
}

function DateReviver(key, value)
{
	if ((key == "Date") || /DateTime$/.test(key))
		return new Date(value.replace(/-/g, '/'));
	else
		return value;
}

