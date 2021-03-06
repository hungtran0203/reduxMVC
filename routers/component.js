import React from 'react'
import router from '../lib/router.js'
import LoginModal from '../containers/modal/login.js'

router.resource('modal.login', (req, res) => { res.setComponent(<LoginModal />) })

import DialogModal from '../containers/modal/dialog.js'
router.resource('modal.dialog', (req, res) => { res.setComponent(<DialogModal />) })

import RegisterContent from '../containers/content/register.js'
router.resource('/user/register', (req, res) => { res.setComponent(<RegisterContent />) })

import SytemMessage from '../containers/systemMessage.js'
router.resource('system_message', (req, res) => { res.setComponent(<SytemMessage />) })

router.resource('modal_message', (req, res) => {	res.setComponent(<SytemMessage src="MODAL_MESSAGES"/>) })

import {Jumbotron} from 'react-bootstrap'
router.resource('homepage', (req, res) => {
	res.setComponent (
	 <Jumbotron>
	    <h1>Hello, world!</h1>
	    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
	  </Jumbotron>
	)
})

router.resource('loading_icon', (req, res) => { res.setComponent(<div>...</div>) })

import ProfileContent from '../containers/content/profile.js'
router.resource('/profile', (req, res) => {	res.setComponent(<ProfileContent />) })

import UsersContent from '../containers/content/users.js'
router.resource('/users', (req, res) => { res.setComponent(<UsersContent />) })

import CategoryController from '../controllers/category.js'
router.get('/categories', (req, res) => {	
	res.setContent('/categories', req.props)
})
router.resource('/categories', (req, res) => {	
	res.setComponent( CategoryController.index() )	
})

import CategoryForm from '../components/form/category.js'
router.get('/category/edit', (req, res) => { res.setComponent( <CategoryForm /> ) })

