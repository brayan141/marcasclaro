const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Controladores
const authController = require('../controllers/auth.controller');
const citiesController = require('../controllers/cities.controller');
const bannersController = require('../controllers/banners.controller');
const textsController = require('../controllers/texts.controller');
const socialNetworksController = require('../controllers/social-networks.controller');
const companyController = require('../controllers/company.controller');

// Middleware
const { authenticateToken } = require('../middleware/jwt');

// Subrutas
const uploadRoutes = require('./upload.routes');

// 📂 Ruta global donde se guardan los archivos
const UPLOADS_DIR = '/home/sotecemc/marcasclaro/uploads';

/**
 * 📦 Configuración de almacenamiento dinámica según tipo de archivo
 */
const createStorage = (prefix) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

/**
 * 🎨 Multer instances por tipo
 */
const uploadBanner = multer({ storage: createStorage('banner') });
const uploadCity = multer({ storage: createStorage('city') });
const uploadCompany = multer({ storage: createStorage('company') });
const uploadSocial = multer({ storage: createStorage('social') });

/**
 * 🔐 AUTH ROUTES
 */
router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.put('/auth/update-password', authenticateToken, authController.updatePassword);
router.get('/auth/users', authenticateToken, authController.getUsers);

/**
 * 🌆 CITIES ROUTES
 */
router.get('/ciudades', citiesController.getCities);
router.post('/ciudades', authenticateToken, uploadCity.single('imagen'), citiesController.createCity);
router.put('/ciudades/:id_city', authenticateToken, uploadCity.single('imagen'), citiesController.updateCity);
router.get('/ciudades/:cityName/images', citiesController.getCityImages);
router.delete('/ciudades/:id_city', authenticateToken, citiesController.deleteCity);

/**
 * 🖼️ BANNERS ROUTES
 */
router.get('/banners', bannersController.getBanners);
router.post('/banners', authenticateToken, uploadBanner.single('imagen'), bannersController.createBanner);
router.put('/banners/:id_banner', authenticateToken, uploadBanner.single('imagen'), bannersController.updateBanner);
router.delete('/banners/:id_banner', authenticateToken, bannersController.deleteBanner);

/**
 * ✍️ TEXTS ROUTES
 */
router.get('/texts', textsController.getTexts);
router.post('/texts', authenticateToken, textsController.createText);
router.put('/texts/:name', authenticateToken, textsController.updateText);
router.delete('/texts/:name', authenticateToken, textsController.deleteText);

/**
 * 🌐 SOCIAL NETWORKS ROUTES
 */
router.get('/social-networks', socialNetworksController.getSocialNetworks);
router.post('/social-networks', authenticateToken, uploadSocial.single('imagen'), socialNetworksController.createSocialNetwork);
router.put('/social-networks/:id', authenticateToken, uploadSocial.single('imagen'), socialNetworksController.updateSocialNetwork);
router.delete('/social-networks/:id', authenticateToken, socialNetworksController.deleteSocialNetwork);

/**
 * 🏢 COMPANY ROUTES
 */
router.get('/company-icon', companyController.getCompanyIcon);
router.post('/company-icon', authenticateToken, uploadCompany.single('imagen'), companyController.createCompanyIcon);
router.put('/company-icon/:filename', authenticateToken, uploadCompany.single('imagen'), companyController.updateCompanyIcon);
router.delete('/company-icon/:filename', authenticateToken, companyController.deleteCompanyIcon);

/**
 * ⬆️ UPLOAD ROUTES
 */
router.use('/upload', uploadRoutes);

module.exports = router;
