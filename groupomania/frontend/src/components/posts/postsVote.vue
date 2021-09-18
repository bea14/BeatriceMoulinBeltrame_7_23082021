<template lang="html">
  <div class="vote">
    <svg @click="aime" :class="{ active: votedUp }" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
    <p>{{ voting }}</p>
    <svg @click="aimepas" :class="{ active: votedDown }" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
      <path d="M0-.75h24v24H0z" fill="none"/>
    </svg>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
    name: 'vote',
    data() {     
    const userId = sessionStorage.getItem('userId') || 0;
    return {
        userId
    }
    },
    props: ['aime', 'aimepas', 'postId'],
    methods: {
        getVotes() {
            const token = sessionStorage.getItem("token");
            const postId= this.postData.id;
            axios
            .get("http://localhost:3000/api/topics/"+postId+"/like", {
            headers: { 'Authorization': "Bearer " + token },
            })
            .then((response) => {
            this.Votes = response.data.vote;
            this.VotesUser = response.data.vote.user;
            console.log('DDDDDDDDDDDDDDDDD',response.data.vote)
            this.aime = response.data.vote.like;
            this.aimepas = response.data.vote.dislike;
            console.log('DDDDDDDDDDDDDDDDD',JSON.stringify(response.data.vote))
            });
        }
    },
    computed: {
        voting() {
            return this.aime.length - this.aimepas.length
        },
        votedUp() {
            for (var i in this.Votes) {
                if (this.VotesUser[i] == this.userId) {
                    return true
                }
            }
            return false
        },
        votedDown() {
            for (var i in this.Votes) {
                if (this.VotesUser[i] == this.userId) {
                    return true
                }
            }
            return false
        }
    },
    mounted() {
    this.getVotes();
  },
}
</script>

<style lang="css">
.vote {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.vote p {
    margin: 10px 0;
}

.vote svg.active {
    fill: red;
}

.vote svg:hover {
    fill: rgb(27, 122, 249);
    cursor: pointer;
}
</style>
