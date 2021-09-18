<template>
    <div class="usersAll">
        <div class="usersAll-header">
            <span>Tous les utilisateurs</span>
            <div class="usersAll-body">
                <ul class="usersAll-item">
                    <li  v-for="result in allUsers" :key="result.id">
                        {{allUsers.avatar}} {{allUsers.pseudo}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
const axios = require("axios").default;
export default {
    name:"usersAll",
    data() {  
        return {
        users: null,
        allUsers: [],
        };
    },
    methods: {
        getUsers() {
        const token = sessionStorage.getItem("token");
        axios
            .get("http://localhost:3000/api/users/profile", {
            headers: { 'Authorization': "Bearer " + token },
            })
            .then((response) => {
            this.allUsers = response.data.results;
            //this.allPosts = JSON.stringify(response.data.post);
            console.log('allUsers',response.data.results)
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',JSON.stringify(response.data.results))
            console.log(response.data.results[0].pseudo)
            });
        },
    },
    mounted() {
        this.getUsers();
    },
}
</script>

<style lang="scss">
@import "../../assets/styles/utils/_variables";
.usersAll {
  background-color: white;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 5px;
    &-header, &-body {
    position: relative;
    height: 80px;
    overflow: hidden;
    width: 100%;
    }
    &-header {
        background-color: $tertiary-color;
        opacity: 0.5;
        span {
            position: absolute;
            bottom: 10px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            z-index: 9999;
        }
    }
    &-item {
        display: flex;
        justify-content: flex-start;
        padding-left: 10px;
        align-items: center;
        height: 50px;
        border-top: 1px solid rgb(228, 226, 226);
        img {
            height: 30px;
            border-radius: 15px;
            margin: 0 10px;
            opacity: 0.6;
        }
        span {
            font-weight: bold;
            font-size: 13px;
            margin: 0 10px;
        }
    }

}

.usersall-item 
.usersall-item .fa-sort-down {
  color: red;
}
.usersall-item .fa-sort-up {
  color: greenyellow;
}
.top__growing__button {
  display: flex;
  align-items: center;
  justify-content: center;
}
.top__growing__button button {
  width: 90%;
  padding: 10px;
  background-color: $primary-color;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 12px;
}
.top__growing__footer__tags {
  display: flex;
  padding: 10px;
  justify-content: space-evenly;
  align-items: center;
  height: 50px;
}
.top__tag__item {
  font-size: 11px;
  font-weight: bold;
  color: $primary-color;
  background-color: rgb(245, 245, 245);
  padding: 8px;
  cursor: pointer;
  border-radius: 20px;
}
.top__tag__item:hover {
  background-color: rgb(233, 233, 233);
}
</style>