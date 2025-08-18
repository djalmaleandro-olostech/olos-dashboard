<template>
    <q-page class="flex flex-center">
        <q-card
            style="width: 320px; height: auto;
            display: flex; flex-direction: column;
            align-items: center;"
        >
            <img
                src="../assets/olostechLogo.svg"
                class="q-mt-lg q-mb-lg q-mx-sm"
                style="width: 85%; max-width: 85%; box-sizing: border-box;"
            />
            <form @keydown.enter.prevent="onSubmit">
                <q-card-section class="q-pt-none full-width">
                    <q-input
                        filled
                        v-model="login.email"
                        label="Email"
                        autocomplete="email"
                        :rules="[ val => val && val.length > 0 || 'Campo Obrigatório!']"
                    />
                    <q-input
                        class="q-mt-sm"
                        v-model="login.password"
                        filled
                        label="Senha"
                        :type="login.isPwd ? 'password' : 'text'"
                        autocomplete="senha-atual"
                        :rules="[ val => val && val.length > 0 || 'Campo Obrigatório!']"
                    >
                        <template v-slot:append>
                        <q-icon
                            :name="login.isPwd ? 'visibility_off' : 'visibility'"
                            class="cursor-pointer"
                            @click="login.isPwd = !login.isPwd"
                        />
                        </template>
                    </q-input>
                </q-card-section>
            </form>
            <q-card-actions
                class="full-width"
                style="display: flex; flex-direction: column; align-items: center;"
            >
                <q-btn
                    class="q-mx-sm"
                    color="primary"
                    label="Login"
                    style="width: 85%"
                    @click="onSubmit"
                />
            </q-card-actions>
            <q-card-actions
                class="full-width"
                style="display: flex; flex-direction: column; align-items: center;"
            >
                <q-btn
                    v-if="true==false"
                    outline no-caps class="q-mx-sm q-mb-lg"
                    color="primary" label="Esqueci minha senha"
                    @click="$router.push({ name: 'esqueciSenha' })"
                    style="width: 85%"
                />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script>
import authService from 'src/services/authService'
import notifications from '../utils/notifications'

export default {
    name: 'LoginPage',
    data () {
        return {
            login: {
                email: 'djalma.leandro@olostech.com',
                password: '123456',
                isPwd: true
            }
        }
    },
    methods: {
        async onSubmit () {
            const { post, setUser, setMenus } = authService('login')
            const { notifyError, notifyWarning } = notifications()

            if(!this.login.email || !this.login.password){
                notifyWarning('Os campos email e senha são obirgatórios')
                return
            }

            const userCredentials = { email: this.login.email, password: this.login.password }
            try {
                const { data } = await post(userCredentials)       
                setUser(data.user)
                setMenus(data.menus)
                this.$router.push({ name: 'home' })
            } catch (error) {                
                if(error.code == 'ERR_NETWORK'){
                    notifyError("Erro de conexão com o servidor. Tente novamente mais tarde.")
                }else if (error.response && error.response.status === 401) {
                    notifyError("Email ou senha incorretos.")
                } else {
                    console.error(error)
                    notifyError("Erro ao efetuar login. Tente novamente.")
                }
            }
        }
    }
}
</script>
