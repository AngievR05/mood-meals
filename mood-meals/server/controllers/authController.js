exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email already exists
    const [userByEmail] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userByEmail.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if username already exists
    const [userByUsername] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (userByUsername.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash password and insert user
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  console.log('Login attempt with identifier:', identifier);

  try {
    // Find user by username OR email
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [identifier, identifier]
    );

    if (!users || users.length === 0) {
      console.log('No user found for identifier:', identifier);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', user.username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT (include user info in payload)
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    console.log('Login successful:', user.username);
    res.json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
};
