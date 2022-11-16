import express from 'express'
import { createRawArticles, showAllArticles } from '../controllers/articleController'

const router = express.Router()

//post website urls for articles, get all articles json data from urls nd save
router.route('/').post(createRawArticles).get()

// show all articles that have been scraped before
router.route('/summary').get()
//get articles scraped by date scraped
router.route('/summary/:dateId')
//get ONE article by the article Id
router.route('/summary/:dateId/:articleId').get().delete().patch()


//get THAT article and summarize
// router.route('/summary').get()
// router.route('/summary/:artcileId').get().delete().patch()



export default router
