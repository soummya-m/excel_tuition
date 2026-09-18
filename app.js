var express = require('express');
var app = express();
var session = require('express-session');
var conn = require('./dbConfig');
var bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
	secret: 'yoursecret',
	resave: true,
	saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.get('/', (req, res) => {
  res.render('home');  
});
app.get('/aboutus', function (req,res){
     res.render("about_us");
});



app.get('/contact', function (req,res){
     res.render("contact");
});
app.get('/login', function (req, res) {
  res.render('login.ejs', { message: null }); 
});

app.get('/register',function(req,res){
    res.render("register",{title:'register.ejs'});
});
app.post('/register', function(req, res) {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let phonenumber = req.body.phonenumber;
  let role = req.body.role;

  if (username && password) {
    
    let checkEmailSql = `SELECT * FROM users WHERE email = ?`;
    conn.query(checkEmailSql, [email], function(err, results) {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }

      if (results.length > 0) {
        
        return res.send('Email already registered. Please use another email or login.');
        
        
      } else {
        
        let sql = `INSERT INTO users (username, email, phonenumber, password, role, status) VALUES (?, ?, ?, ?, ?, 'pending')`;
        conn.query(sql, [username, email, phonenumber, password, role], function(err, result) {
          if (err) {
            console.error(err);
            return res.status(500).send('Failed to register user');
          }
          console.log('record inserted');
         res.render('login', {
            message: '✅ Registration successful! Your account is pending admin approval and will be reviewed within 24 hours.'
          });
        });
      }
    });
  } else {
    res.send('Please enter username and password');
  }
});



app.post('/auth', function(req, res) {
	let email = req.body.email;
	let password = req.body.password;

	if (email && password) {
		conn.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], 
		function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
        if (results[0].status !== 'approved') {
    return res.send('Your account has not been approved yet. Please wait for admin approval.');
}

        
				req.session.loggedin = true;
				req.session.email = email;
				req.session.role = results[0].role;
				req.session.username =results[0]. username;
        req.session.user = {
  user_id: results[0].user_id,
  username: results[0].username,  
  email: results[0].email,
  role: results[0].role
};

				if (req.session.role === 'student') {
					res.redirect('/studentonly');
				} else if (req.session.role === 'tutor') {
					res.redirect('/tutoronly');
				} else if (req.session.role === 'admin') {
					res.redirect('/adminOnly');
				} else if (req.session.role === 'parent') {
					res.redirect('/parentOnly');
				} else {
					res.send('Unknown role. Access denied.');
				}
			} else {
        return res.render('login.ejs', { message: 'Incorrect Email and/or Password!' });
			}
		});
	} else {
		res.send('Please enter Email and Password!');
	}
});

app.get('/studentonly', function (req, res) {
  if (req.session.loggedin && req.session.role === "student") {
    res.render('studentonly', {
      user: req.session.user   
    });
  } else {
    res.send('Access Denied. Students only.');
  }
});


app.get('/tutoronly', function (req, res) {
    if (req.session.loggedin && req.session.role === 'tutor') {
        res.render('tutoronly', { user: req.session.user });
    } else {
        res.send('Access Denied. Tutors only.');
    }
});

app.get('/adminonly', function (req, res) {
    if (req.session.loggedin && req.session.role === 'admin') {
        res.render('adminonly', { user: req.session.user });
    } else {
        res.send('Access Denied. Admin only.');
    }
});	 
app.get('/parentonly', function (req, res) {
    if (req.session.loggedin && req.session.role === 'parent') {
        res.render('parentonly', { user: req.session.user });
    } else {
        res.send('Access Denied. Parent only.');
    }
});	 
app.get('/our_tutors', (req, res) => {
  const query = 'SELECT our_tutors.*, users.username AS tutor_name FROM our_tutors JOIN users ON our_tutors.tutor_id = users.user_id';

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal Server Error');
    }

    console.log('Query results:', results); 
    res.render('our_tutors', { our_tutors: results }); 
  });
});
app.get('/course_details', (req, res) => {
  const query = `
    SELECT course_details.*, users.username AS tutor_name
    FROM course_details
    JOIN users ON course_details.tutor_id = users.user_id
  `;

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal Server Error');
    }

    console.log('Query results:', results); 
    res.render('course_details', { course_details: results }); 
  });
});
app.get('/book_class', (req, res) => {
  
  if (!req.session.loggedin || req.session.user.role !== 'student') {
    return res.status(401).send('Unauthorized: Please log in as a student.');
  }

  const query = `
    SELECT course_details.*, users.username AS tutor_name
    FROM course_details
    JOIN users ON course_details.tutor_id = users.user_id
  `;

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Internal Server Error');
    }

    
    res.render('book_class', {
      courses: results,
      user: req.session.user,
      booked: req.query.booked 
    });
  });
});
app.post('/book_class', (req, res) => {
  
  if (!req.session.loggedin || req.session.user.role !== 'student') {
    return res.status(401).send('Unauthorized: Please log in as a student.');
  }

  const userId = req.session.user.user_id;
  const courseId = req.body.course_id;

  
  if (!courseId || !userId) {
    return res.status(400).send('Missing course or user information.');
  }

  
  const getTutorQuery = `
    SELECT tutor_id FROM course_details WHERE course_id = ?
  `;

  conn.query(getTutorQuery, [courseId], (err, tutorResults) => {
    if (err) {
      console.error('❌ Error fetching tutor_id:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (tutorResults.length === 0) {
      console.warn('⚠️ Course not found for course_id:', courseId);
      return res.status(404).send('Course not found');
    }

    const tutorId = tutorResults[0].tutor_id;

    
    const checkExistingQuery = `
      SELECT * FROM student_course
      WHERE user_id = ? AND course_id = ?
    `;

    conn.query(checkExistingQuery, [userId, courseId], (err, existingRows) => {
      if (err) {
        console.error('❌ Error checking existing booking:', err);
        return res.status(500).send('Internal Server Error');
      }

      if (existingRows.length > 0) {
        console.log('ℹ️ Booking already exists for user:', userId, 'and course:', courseId);
        return res.redirect('/book_class?booked=already');
      }

      
      const insertQuery = `
        INSERT INTO student_course (user_id, course_id, tutor_id)
        VALUES (?, ?, ?)
      `;

      conn.query(insertQuery, [userId, courseId, tutorId], (err, insertResult) => {
        if (err) {
          console.error('❌ Error inserting booking:', err);
          return res.status(500).send('Internal Server Error');
        }

        if (insertResult.affectedRows === 0) {
          console.warn('⚠️ Booking insert failed, no rows affected');
          return res.redirect('/book_class?booked=fail');
        }

        console.log('✅ Booking successful:', {
          user_id: userId,
          course_id: courseId,
          tutor_id: tutorId
        });

        return res.redirect('/book_class?booked=true');
      });
    });
  });
});



app.get('/leave_request', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }

    res.render('leave_request', {
        user: req.session.user 
    });
});
app.post('/leave_request', (req, res) => {
  const user_id = req.session.user.user_id; 

  const { start_date, end_date, reason } = req.body;

  
  if (!start_date || !end_date || !reason) {
    return res.status(400).send('All fields are required');
  }

  
  const sql = `INSERT INTO leave_request 
               (user_id, start_date, end_date, reason, status, comment) 
               VALUES (?, ?, ?, ?, "pending", "")`;


  conn.query(sql, [user_id, start_date, end_date, reason], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.redirect('/leave_request'); 
  });
});
app.get('/leave_status', (req, res) => {
  const userId = req.session.user.user_id;

  const sql = `SELECT * FROM leave_request WHERE user_id = ?`;

  conn.query(sql, [userId], (err, results) => {
    if (!req.session.user) {
  return res.redirect('/login');
  }

 const userId = req.session.user.user_id;

    res.render('leave_status', {
      leaveRequests: results,
      user: req.session.user
    });
  });
});

app.get('/progress_report', (req, res) => {
  console.log("req.session.user.role : ===", req.session.user?.role, "===");

    if (!req.session.user || req.session.user.role == 'tutor' || req.session.user.role == 'admin' ) {
        return res.redirect('/login');
    }


    const userId = req.session.user.user_id;

    let query = "";
    if (req.session.user.role == 'student') {
      query = query = `SELECT progress_report.*, users.username AS student_username
      FROM progress_report
      JOIN users ON progress_report.user_id = users.user_id
      WHERE progress_report.user_id = ?
    `;


    } else if (req.session.user.role == 'parent') {
      query = query = `
     SELECT progress_report.*, users.username AS student_username
     FROM progress_report
     JOIN student_parent ON progress_report.user_id = student_parent.student_id
     JOIN users ON progress_report.user_id = users.user_id
     WHERE student_parent.parent_id = ?`;

    }


    console.log(query);

    conn.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching progress reports:', err);
            return res.status(500).send('Database error');
        }

        res.render('progress_report', {
            reports: results,
            user: req.session.user
        });
    });
});



app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/');
    });
});


app.get('/student_list', (req, res) => {

  const tutorId = req.session.user?.user_id;

  
  if (!req.session.loggedin || req.session.user.role !== 'tutor') {
    return res.status(401).send('Unauthorized: Please log in as a tutor.');
  }

  const query = `
    SELECT u.user_id, u.username, u.email, cd.course_name AS subject
    FROM users u
    JOIN student_course sc ON u.user_id = sc.user_id
    JOIN course_details cd ON sc.course_id = cd.course_id
    WHERE sc.tutor_id = ? AND u.role = 'student'
  `;

  conn.query(query, [tutorId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    
    res.render('student_list', {
      students: results,
      user: req.session.user
    });
  });
});

app.get('/approve_users', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }

  const sql = `SELECT * FROM users`;

  conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Database error');
    }
    
    res.render('approve_users', { users: results, user: req.session.user });
  });
});


app.post('/admin/approve-user/:userId', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }
  const userId = req.params.userId;
  conn.query('UPDATE users SET status = ? WHERE user_id = ?', ['approved', userId], (err) => {
    if (err) {
      console.error('Error approving user:', err);
      return res.status(500).send('Database error');
    }
    res.redirect('/approve_users');
  });
});

app.post('/admin/reject-user/:userId', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied.');
  }
  const userId = req.params.userId;
  conn.query('UPDATE users SET status = ? WHERE user_id = ?', ['rejected', userId], (err) => {
    if (err) {
      console.error('Error rejecting user:', err);
      return res.status(500).send('Database error');
    }
    res.redirect('/approve_users');
  });
});




app.get('/update_course', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }

  const courseQuery = `
    SELECT course_details.*, users.username AS tutor_name 
    FROM course_details
    JOIN users ON course_details.tutor_id = users.user_id
  `;

  const tutorsQuery = `SELECT user_id, username FROM users WHERE role = 'tutor'`;

  conn.query(courseQuery, (err, courses) => {
    if (err) {
      console.error('Error fetching courses:', err);
      return res.status(500).send('Error fetching courses');
    }

    conn.query(tutorsQuery, (err, tutors) => {
      if (err) {
        console.error('Error fetching tutors:', err);
        return res.status(500).send('Error fetching tutors');
      }

      
      let maxId = 0;
      courses.forEach(c => {
        const num = parseInt(c.course_id);
        if (!isNaN(num) && num > maxId) maxId = num;
      });
      const nextCourseId = (maxId + 1).toString();

      res.render('update_course', { courses, tutors, nextCourseId });
    });
  });
});

app.post('/update_course/add', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }

  const { course_id, course_name, tutor_id, course_price, days, time } = req.body;

  const sql = `
    INSERT INTO course_details (course_id, course_name, tutor_id, course_price, days, time)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  console.log('Adding course:', { course_id, course_name, tutor_id, course_price, days, time });

  conn.query(sql, [course_id, course_name, tutor_id, course_price, days, time], (err, result) => {
    if (err) {
      console.error('Error inserting course:', err);
      return res.status(500).send('Database insert error');
    }

    res.redirect('/update_course');
  });
});

app.post('/update_course/:course_id', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }

  const courseId = req.params.course_id;
  const { course_name, tutor_id, course_price, days, time } = req.body;

  const sql = `
    UPDATE course_details 
    SET course_name = ?, tutor_id = ?, course_price = ?, days = ?, time = ?
    WHERE course_id = ?
  `;

  console.log('Updating course:', { courseId, course_name, tutor_id, course_price, days, time });

  conn.query(sql, [course_name, tutor_id, course_price, days, time, courseId], (err, result) => {
    if (err) {
      console.error('Error updating course:', err);
      return res.status(500).send('Database update error');
    }

    res.redirect('/update_course');
  });
});



app.get('/update_tutor', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }

  const tutorSql = `
    SELECT our_tutors.*, users.username 
    FROM our_tutors 
    JOIN users ON our_tutors.tutor_id = users.user_id 
    ORDER BY our_tutors.id ASC
  `;

  const usersSql = `
    SELECT user_id, username 
    FROM users 
    WHERE role = 'tutor'
  `;

  conn.query(tutorSql, (err, tutorResults) => {
    if (err) {
      return res.status(500).send('Database query error');
    }

    let maxTutorId = 0;
    tutorResults.forEach(row => {
      const currentTutorId = parseInt(row.tutor_id, 10);
      if (!isNaN(currentTutorId) && currentTutorId > maxTutorId) {
        maxTutorId = currentTutorId;
      }
    });

    const nextTutorId = maxTutorId + 1;

    
    conn.query(usersSql, (err, userResults) => {
      if (err) {
        return res.status(500).send('Error fetching users');
      }

      res.render('update_tutor', {
        tutors: tutorResults,
        users: userResults,
        nextTutorId
      });
    });
  });
});

app.post('/update_tutor/:id', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }

  const tutorId = req.params.id;
  const { tutor_id, subject, email, phone } = req.body;

  const sql = 'UPDATE our_tutors SET tutor_id = ?, subject = ?, email = ?, phone = ? WHERE id = ?';
  
  conn.query(sql, [tutor_id, subject, email, phone, tutorId], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('Database update error');
    }

    res.redirect('/update_tutor');
  });
});
app.post('/add_tutor', (req, res) => {
  if (!req.session.loggedin || req.session.role !== 'admin') {
    return res.status(403).send('Access denied. Admins only.');
  }

  const { tutor_id, subject, email, phone } = req.body;

  const sql = 'INSERT INTO our_tutors (tutor_id, subject, email, phone) VALUES (?, ?, ?, ?)';

  conn.query(sql, [tutor_id, subject, email, phone], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).send('Database insert error');
    }

    res.redirect('/update_tutor');
  });
});

app.get('/admin_student_course', (req, res) => {
  
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }

  const query = `
    SELECT
      sc.course_id,
      u.username AS student_name,
      c.course_name,
      t.username AS tutor_name
    FROM student_course sc
    JOIN users u ON sc.user_id = u.user_id
    JOIN course_details c ON sc.course_id = c.course_id
    JOIN users t ON c.tutor_id = t.user_id
    ORDER BY sc.id DESC
  `;

  conn.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching student_course data:', err);
      return res.status(500).send('Database error');
    }
    res.render('admin_student_course', { records: results, user: req.session.user });
  });
});
app.get('/progress_reportform', (req, res) => {
  if (!req.session.loggedin || req.session.user?.role !== 'tutor') {
    return res.status(403).send('Access denied. Tutors only.');
  }

  const tutorId = req.session.user.user_id;

  const studentQuery = `
    SELECT u.user_id, u.username, cd.course_name, sc.id as 'st_co_id'
    FROM users u
    JOIN student_course sc ON u.user_id = sc.user_id
    JOIN course_details cd ON sc.course_id = cd.course_id
    WHERE sc.tutor_id = ? AND u.role = 'student'
  `;

  
  const courseQuery = `
    SELECT course_id, course_name
    FROM course_details
    WHERE tutor_id = ?
  `;

  conn.query(studentQuery, [tutorId], (err, students) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).send('Server error');
    }

    console.log("====student info ====");
    console.log(students);

    conn.query(courseQuery, [tutorId], (err, courses) => {
      if (err) {
        console.error('Error fetching courses:', err);
        return res.status(500).send('Server error');
      }

      res.render('progress_reportform', {
        message: null,
        user: req.session.user,
        students: students,
        subjects: courses  
      });
    });
  });
});
app.post('/progress_reportform', (req, res) => {
  const { date, user_id, subject, score, attendance, feedback } = req.body;

  // ✅ First, fetch the student name using the user_id
  const getStudentNameQuery = `SELECT username FROM users WHERE user_id = ?`;

  conn.query(getStudentNameQuery, [user_id], (err, result) => {
    if (err || result.length === 0) {
      console.error('Error fetching student name:', err);
      return res.status(500).send('Could not retrieve student name.');
    }

    const student_name = result[0].username;

    // ✅ Now insert the progress report with correct student name
    const insertQuery = `
      INSERT INTO progress_report (date, user_id, student_name, subject, score, attendance, feedback)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(
      insertQuery,
      [date, user_id, student_name, subject, score, attendance, feedback],
      (err, result) => {
        if (err) {
          console.error('Insert Error:', err);
          return res.status(500).send('Error saving progress report');
        }

        res.render('progress_reportform', {
          message: 'Progress report submitted successfully!',
          user: req.session.user, // not req.session.username/email here
          students: [],           // optionally reload students if needed
          subjects: []
        });
      }
    );
  });
});

app.get('/approve_leave', (req, res) => {
  const tutorId = req.session.user?.user_id;

  if (!req.session.loggedin || req.session.user.role !== 'tutor') {
    return res.status(401).send('Unauthorized: Please log in as a tutor.');
  }

  const query = `
    SELECT lr.id, lr.user_id, lr.start_date, lr.end_date, lr.reason, lr.status, lr.comment,
           u.username AS student_name, u.email
    FROM leave_request lr
    JOIN users u ON lr.user_id = u.user_id
    JOIN student_course sc ON u.user_id = sc.user_id
    WHERE sc.tutor_id = ? AND u.role = 'student'
    ORDER BY lr.start_date DESC
  `;

  conn.query(query, [tutorId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    
    
    const updatedId = req.query.updatedId || null;
    res.render('approve_leave', {
      leaveRequests: results,
      user: req.session.user,
      updatedId
    });
  });
});
app.post('/approve_leave/:id', (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;

  const sql = 'UPDATE leave_request SET status = ?, comment = ? WHERE id = ?';

  conn.query(sql, [status, comment, id], (err, result) => {
    if (err) {
      console.error('Error updating leave request:', err);
      return res.status(500).send('Error updating leave request.');
    }

    res.redirect('/approve_leave?updatedId=' + id);
  });
});
app.get('/student_parent', (req, res) => {
  if (!req.session.loggedin || req.session.user.role !== 'parent') {
    return res.status(403).send('Access denied. Parents only.');
  }

  const parent_id = req.session.user.user_id;


  res.render('student_parent', {
    parent_id,
    message: null
  });
});


app.post('/student_parent', (req, res) => {

  if (!req.session.loggedin || req.session.user.role !== 'parent') {
    return res.status(403).send('Access denied. Parents only.');
  }

  const parent_id = req.session.user.user_id;
  const { student_email, relation } = req.body;

  if (!student_email || !relation) {
    return res.status(400).send('All fields are required');
  }

  
  const findStudentSql = 'SELECT user_id FROM users WHERE email = ? AND role = "student"';

  conn.query(findStudentSql, [student_email], (err, results) => {
    if (err) {
      console.error('Error finding student:', err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(404).send('No student found with that email.');
    }

    const student_id = results[0].user_id;

    
    const insertSql = 'INSERT INTO student_parent (parent_id, student_id, relation) VALUES (?, ?, ?)';

    conn.query(insertSql, [parent_id, student_id, relation], (err2) => {
      if (err2) {
        if (err2.code === 'ER_DUP_ENTRY') {
          return res.status(409).send('This student is already linked to your account.');
        }
        console.error('Error inserting relation:', err2);
        return res.status(500).send('Database error');
      }

      
      res.redirect('/student_parent');
    });
  });
});


app.listen(3000);
console.log('Running at Port 3000');
