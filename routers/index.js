import router from '../lib/router.js'

import componentRouter from './component.js'
import controllerRouter from './controller.js'

router.get('/abcd/:id/', (req, res, next) => {console.log('rrrr', req, res)});
router.get('/abcd/hungtran/:okie', (req, res, next) => {console.log('llll', req, res)});
router.get('abcd@xasd', (req, res, next) => {console.log('eeee', req, res)});

var rtn = router.dispatch('loading_icon')


console.log('vvvvvvvvv', rtn)

export default router;