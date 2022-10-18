function setup() {
  print("test 1 go");
  test1();
  print("test 1 passed");
}

async function test1() {
  const options = {
	   authProvider,
  };

  const client = Client.init(options);

  let user = await client.api('/me').get();

  print(user);
}
