const run = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sundrip.com', password: 'admin123' })
    }).then(res => res.json());

    const token = loginRes.token;

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: "Test Product",
        price: 199,
        description: "Test description",
        category: "Shirts",
        stock: 10,
        images: ["/uploads/test.jpg"]
      })
    });

    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("DATA:", data);
  } catch (err) { console.error("FATAL", err); }
};
run();
