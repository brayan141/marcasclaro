const express = require('express');
const router = express();

const authController = require('../controllers/auth.controller');
const citiesController = require('../controllers/cities.controller');
const bannersController = require('../controllers/banners.controller');
const textsController = require('../controllers/texts.controller');
const socialNetworksController = require('../controllers/social-networks.controller');
const companyController = require('../controllers/company.controller');
const uploadRoutes = require('./upload.routes');
const { authenticateToken } = require('../middleware/jwt');

module.exports = () => {
    // Auth routes
    router.post('/auth/login', authController.login);
    router.post('/auth/register', authController.register);
    router.put('/auth/update-password', authenticateToken, authController.updatePassword);
    router.get('/auth/users', authenticateToken, authController.getUsers);

    // Cities routes
    router.get('/ciudades', authenticateToken, citiesController.getCities);
    router.put('/ciudades/:filename', authenticateToken, citiesController.updateCity);
    router.get('/ciudades/:cityName/images', authenticateToken, citiesController.getCityImages);
    router.delete('/ciudades/:filename', authenticateToken, citiesController.deleteCity);

    // Banners routes
    router.get('/banners', authenticateToken, bannersController.getBanners);
    router.put('/banners/:filename', authenticateToken, bannersController.updateBanner);
    router.delete('/banners/:filename', authenticateToken, bannersController.deleteBanner);

    // Texts routes
    router.get('/texts', authenticateToken, textsController.getTexts);
    router.put('/texts/:name', authenticateToken, textsController.updateText);
    router.delete('/texts/:name', authenticateToken, textsController.deleteText);

    // Social Networks routes
    router.get('/social-networks', authenticateToken, socialNetworksController.getSocialNetworks);
    router.put('/social-networks/:id', authenticateToken, socialNetworksController.updateSocialNetwork);
    router.delete('/social-networks/:id', authenticateToken, socialNetworksController.deleteSocialNetwork);

    // Company routes
    router.get('/company-icon', authenticateToken, companyController.getCompanyIcon);
    router.put('/company-icon/:filename', authenticateToken, companyController.updateCompanyIcon);
    router.delete('/company-icon/:filename', authenticateToken, companyController.deleteCompanyIcon);

    // Upload routes
    router.use('/upload', uploadRoutes);

    return router;
}
