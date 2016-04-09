import React from 'react'
import router from '../lib/router.js'

import LoginModal from '../containers/modal/login.js'
router.get('modal.login', (req, res) => { res.setComponent(<LoginModal />) })

import DialogModal from '../containers/modal/dialog.js'
router.get('modal.dialog', (req, res) => { res.setComponent(<DialogModal />) })

import RegisterContent from '../containers/content/register.js'
router.get('/user/register', (req, res) => { res.setComponent(<RegisterContent />) })

import SytemMessage from '../containers/systemMessage.js'
router.get('system_message', (req, res) => { res.setComponent(<SytemMessage />) })

router.get('modal_message', (req, res) => {	res.setComponent(<SytemMessage src="MODAL_MESSAGES"/>) })

import {Jumbotron} from 'react-bootstrap'
router.get('homepage', (req, res) => {
	res.setComponent (
	 <Jumbotron>
	    <h1>Hello, world!</h1>
	    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
	  </Jumbotron>
	)
})

router.get('loading_icon', (req, res) => { res.setComponent(<div>...</div>) })

import ProfileContent from '../containers/content/profile.js'
router.get('/profile', (req, res) => {	res.setComponent(<ProfileContent />) })

import UsersContent from '../containers/content/users.js'
router.get('/users', (req, res) => { res.setComponent(<UsersContent />) })

import CategoryController from '../controllers/category.js'
router.get('/categories', (req, res) => {	
	res.setComponent( CategoryController.index() )
	res.setContent('/categories')
})

import CategoryForm from '../components/form/category.js'
router.get('/category/edit', (req, res) => { res.setComponent( <CategoryForm /> ) })

