<template>
    <v-app id="inspire">
        <v-navigation-drawer :clipped="$vuetify.breakpoint.lgAndUp" v-model="drawer" fixed app>
            <v-list dense>
                <template v-for="item in items">
                    <v-list-tile :key="item.text" @click="switchType(item.type)">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="blue darken-3" dark app fixed>
            <v-toolbar-title class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-sm-and-down">JWT-DEMO</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon large>
                <v-avatar size="32px" tile>
                    <img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify">
                </v-avatar>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center>
                    <v-flex xs12>
                        <v-card hover>
                            <v-card-title primary-title>
                            <div>
                                <h3 class="headline mb-0">{{content.title}}</h3>
                            </div>
                            </v-card-title>
                            <v-card-text>
                                <div class="text" v-html="content.text"></div> 
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        data: () => ({
            drawer: null,
            content: {
                title: '',
                text: ''
            },
            items: [{
                    icon: 'mdi-contacts',
                    text: '获取用户信息',
                    type: 1
                },
                {
                    icon: 'mdi-history',
                    text: '查看token',
                    type: 2
                },
                {
                    icon: 'mdi-delete',
                    text: '删除token并请求',
                    type: 3
                },
                {
                    icon: 'mdi-logout',
                    text: '退出/重新登录',
                    type: 4
                }
            ]
        }),
        created(){
            this.getUser();
        },
        methods: {
            switchType(type){
                switch (type) {
                    case 1:
                        this.getUser();
                        break;
                    case 2:
                        this.getToken();
                        break;
                    case 3:
                        this.delToken();
                        break;
                    case 4:
                        this.logout();
                        break;
                }
            },
            getUser(){
                this.$axios.get('/api/info').then(res => {
                    this.content = {
                        title: '用户信息',
                        text: `
                            <p>描述：请求头中带着 token 发起请求，获取用户信息</p>
                            <p>请求接口：'/api/info'</p>
                            <p>请求结果：${JSON.stringify(res)}</p>
                        `
                    }
                })
            },
            getToken(){
                const token = localStorage.getItem('token');
                const token_exp = localStorage.getItem('token_exp');
                const now_time = new Date().getTime();
                console.log(now_time - token_exp);
                this.content = {
                    title: 'token',
                    text: `
                        <p>当前的 token 为：${token}</p>
                        <p>token过期时间还剩：${1000 * 60 * 60 * 2 - (now_time - token_exp)} ms</p>
                    `
                }
            },
            delToken(){
                localStorage.removeItem('token');
                localStorage.removeItem('token_exp');
                this.$axios.get('/api/info').then(res => {
                    this.content = {
                        title: '用户信息',
                        text: `
                            <p>描述：请求头中带着 token 发起请求，获取用户信息</p>
                            <p>请求接口：'/api/info'</p>
                            <p>请求结果：${JSON.stringify(res)}</p>
                        `
                    }
                }).catch(err => {
                    this.$toast('登录状态已失效，请重新登录');
                    this.content = {
                        title: '无token请求',
                        text: `
                            <p>描述：请求头中没有 token 发起请求</p>
                            <p>请求接口：'/api/info'</p>
                            <p>请求结果：${JSON.stringify(err.response)}</p>
                        `
                    }
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 2500);
                })
            },
            logout(){
                localStorage.removeItem('token');
                localStorage.removeItem('token_exp');
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>
.text{
    word-wrap: break-word;
}
</style>
