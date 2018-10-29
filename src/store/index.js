import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
Vue.use(Vuex)

const state = {
  isLogin: false,
  username: "",
  loginId: sessionStorage.getItem('zby_loginId'),
  role: sessionStorage.getItem('zby_role'),
  newrouter: [],
  userInfo: {
    id: 2
  }, //用户信息
  cartList: {}, // 加入购物车的商品列表
  remarkText: null, //可选备注内容
  login: true, //是否登录
  cartPrice: null, //会员卡价格

}


export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
