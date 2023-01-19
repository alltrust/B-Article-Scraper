import express from 'express'
import { createRawArticles, getAllArticles, patchArticle, deleteArticleDocOrArticle, selectSentence } from '../controllers/articleController'
import authMiddleWare from '../middleware/auth'

const router = express.Router()

//post website urls for articles, get all articles json data from urls nd save
router.route('/').post(authMiddleWare, createRawArticles).get(authMiddleWare, getAllArticles)

// show all articles that have been scraped before
router.route('/:articleDocId').patch(authMiddleWare, patchArticle).delete(authMiddleWare, deleteArticleDocOrArticle)
//get articles scraped by date scraped
router.route('/:articleDocId/:articleId').delete(authMiddleWare, deleteArticleDocOrArticle)
//get ONE article by the article Id
router.route('/:articleDocId/:articleId/:sentenceId').patch(authMiddleWare, selectSentence)


//get THAT article and summarize
// router.route('/summary').get()
// router.route('/summary/:artcileId').get().delete().patch()



export default router
