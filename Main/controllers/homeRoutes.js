const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');
const sharp = require('sharp'); // Require Sharp library for formatting images uploaded for user profile picture)
// Sharp resizes profile picture and gives format you decide (like png, webp, etc.) turns it into a buffer and then allows to be sent to the handlebars

router.get('/', async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const projectData = await Project.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // Serialize data so the template can read it
    const projects = projectData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      projects, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectData = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const project = projectData.get({ plain: true });

    res.render('project', {
      ...project,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Project }],
    });

    const user = userData.get({ plain: true });
  
    let image;
    if (user.picture){
     console.log(user)
     image = await sharp(user.picture)
      .resize(300)
      .toFormat('png')
      .toBuffer()
      .then((resizedBuffer) => {
        const base64Image = resizedBuffer.toString('base64');
        return `data:image/png;base64,${base64Image}`;
      });
     
    } else {
      console.log('no image hit');
      image = "https://placehold.co/400"
    }
    res.render('profile', {
      ...user,
      image,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;
