import React from 'react';
import {attach, resolve, attachController} from '../lib/componentProvider.js'

import LoginModal from '../containers/modal/login.js'
attach('modal.login', () => {
	return <LoginModal />
})

import DialogModal from '../containers/modal/dialog.js'
attach('modal.dialog', () => {
	return <DialogModal />
})

import RegisterContent from '../containers/content/register.js'
attach('/user/register', () => {
	return <RegisterContent />
})

import SytemMessage from '../containers/systemMessage.js'
attach('system_message', () => {
	return <SytemMessage />
})

attach('modal_message', () => {
	return <SytemMessage src="MODAL_MESSAGES"/>
})

import {Jumbotron} from 'react-bootstrap'
attach('homepage', () => {
	return (
	 <Jumbotron>
	    <h1>Hello, world!</h1>
	    <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
	  </Jumbotron>
	)
})

attach('loading_icon', () => {
	return <div>...</div>
})

import ProfileContent from '../containers/content/profile.js'
attach('/profile', () => {
	return <ProfileContent />
})

import UsersContent from '../containers/content/users.js'
attach('/users', () => {
	return <UsersContent />
})

import CategoriesContent from '../containers/content/categories.js'
attach('/categories', () => {
	return <CategoriesContent />
})

import CategoryForm from './form/category.js'
attach('/category/edit', () => {
	return <CategoryForm />
})


import CategoryController from '../controllers/category.js'
attachController(CategoryController);

