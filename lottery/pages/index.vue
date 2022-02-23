<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="12" md="12" style="padding: 0px">
      <!-- <v-col cols="12" sm="8" md="8"> -->
      <!-- Curtain -->
      <div class="rxWorld">
        <section id="rnOuter1" class="rnOuter">
          <section class="aoTable">
            <div class="aoTableCell">
              <!-- Spin Wheel Section -->
              <div id="wheelOfFortune">
                <canvas id="wheel" width="600" height="600"></canvas>
                <div id="spin">শুরু</div>
              </div>
              <!-- End of Spin Wheel Section -->
            </div>
          </section>
          <div id="rnInner1" class="rnInner">
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
            <div class="rnUnit"></div>
          </div>
        </section>
      </div>
      <!-- End of Curtain -->
    </v-col>

    <!-- Result Dialog -->
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="primary"> বিজয়ীদের তালিকা </v-card-title>
        <v-card-text>
          <v-list>
            <template v-if="winnerList && winnerList.length">
              <v-list-item v-for="(winner1, index) in winnerList" :key="index">
                <v-list-item-icon>
                  {{ winner1.position }}
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    winner1.winner.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-else>এখনও কেউ বিজয়ী হিসেবে নির্বাচিত হয় নাই।</template>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            বন্ধ করুন
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Swal from 'sweetalert2'
import randomColor from 'randomcolor'
import 'sweetalert2/dist/sweetalert2.min.css'
import consumers from '~/consumerData.json'
// const fs = require('fs')

export default {
  name: 'IndexPage',
  asyncData() {
    return { consumers }
  },
  data() {
    return {
      dialog: false,
      sectors: [],
      rand: (m, M) => Math.random() * (M - m) + m,
      tot: 0,
      EL_spin: null,
      ctx: null,
      dia: 0,
      rad: 0,
      PI: 0,
      TAU: 0,
      arc: null,
      friction: 0.991, // 0.995=soft, 0.99=mid, 0.98=hard
      angVel: 0, // Angular velocity
      ang: 0, // Angle in radians
      isWheelSpinning: false,
      winner: null,
      winnerPosition: 10,
      winnerList: [],
    }
  },
  async mounted() {
    // this.removingDuplicateList()
    /** End of Testing file writing */
    this.$nuxt.$on('startLottery', this.startLottery)
    this.$nuxt.$on('showResult', this.showResult)
    await this.sakilVar()
    await this.initializeLotteryBoard()
  },
  methods: {
    /**
     * Showing Result
     */
    showResult() {
      this.dialog = true
    },
    /**
     * Starting the Lottery. Removing the Curtain
     */
    startLottery() {
      // const getRnOuter = document.getElementById('rnOuter1')
      const getRnInner = document.getElementById('rnInner1')
      // console.log(getRnOuter)
      if (getRnInner) {
        const x = getRnInner.style
        x.transformOrigin = '-120% top' // Rotate in the center of div.
        x.transform = 'scaleX(0)'
      }
    },
    sakilVar() {
      this.EL_spin = document.querySelector('#spin')
      this.ctx = document.querySelector('#wheel').getContext('2d')
      this.dia = this.ctx.canvas.width
      // console.log(this.dia)
      this.rad = this.dia / 2
      this.PI = Math.PI
      this.TAU = 2 * this.PI

      // generating large sectors based on data file
      this.consumers.map(
        (consumer) => (consumer.smsNo = consumer.bookNo + consumer.accountNo)
      )
      // console.log(this.consumers)
      const result = []
      const map = new Map()
      for (const item of this.consumers) {
        if (!map.has(item.smsNo)) {
          map.set(item.smsNo, true) // set any value to Map
          result.push(item)
        }
      }
      // console.log(result)
      this.consumers = result
      // shuffling the object
      this.consumers.sort(() => Math.random() - 0.5)
      // console.log(this.consumers)
      // for (let index = 0; index < 50; index++) {
      for (let index = 0; index < this.consumers.length; index++) {
        const color = randomColor() // a hex code for an attractive color
        // console.log(color)
        this.sectors.push({
          color,
          bookNo: Number(this.consumers[index].bookNo).toLocaleString('bn-BD'),
          accountNo: Number(this.consumers[index].accountNo).toLocaleString(
            'bn-BD'
          ),
          name: this.consumers[index].name,
          mobileNo: this.consumers[index].mobileNo,
          officeName: this.consumers[index].officeName,
        })
        // this.sectors.push({
        //   color,
        //   bookNo: (index + 1).toLocaleString('bn-BD'),
        //   accountNo: (index + 1000).toLocaleString('bn-BD'),
        //   name: `Mr. ${index + 1}`,
        //   mobileNo: '01857319767',
        // })
      }
      this.tot = this.sectors.length || 1
      this.arc = this.TAU / (this.sectors.length || 1)
    },

    async initializeLotteryBoard() {
      // INIT
      await this.sectors.forEach(this.drawSector)
      this.rotate() // Initial rotation
      this.engine() // Start engine
      /**
       * Starting the Rotate/Spinning Function
       * @param null
       */
      this.EL_spin.addEventListener('click', this.clickHandler)
    },
    /**
     * Handler Function
     */
    clickHandler(e) {
      // console.log('Button Clicked')
      // setting the Wheel Spinning State to True
      this.isWheelSpinning = true
      if (!this.angVel) this.angVel = this.rand(0.25, 0.35)
    },
    /**
     * Drawing Sector Funtion
     * @param sector
     * @param i
     */
    drawSector(sector, i) {
      const ang = this.arc * i
      this.ctx.save()
      // COLOR
      this.ctx.beginPath()
      this.ctx.fillStyle = sector.color
      this.ctx.moveTo(this.rad, this.rad)
      this.ctx.arc(this.rad, this.rad, this.rad, ang, ang + this.arc)
      this.ctx.lineTo(this.rad, this.rad)
      this.ctx.fill()
      // TEXT
      this.ctx.translate(this.rad, this.rad)
      this.ctx.rotate(ang + this.arc / 2)
      this.ctx.textAlign = 'right'
      this.ctx.fillStyle = '#fff'
      this.ctx.font = 'bold 10px sans-serif'
      this.ctx.fillText(
        `${sector.name}(${sector.bookNo}/${sector.accountNo})`,
        this.rad - 10,
        10
      )
      //
      this.ctx.restore()
    },
    /**
     * Getting Index Funtion
     * @param null
     */
    getIndex() {
      // console.log(this.tot);
      const test =
        Math.floor(this.tot - (this.ang / this.TAU) * this.tot) % this.tot
      // console.log(test)
      return test
    },

    /**
     * Rotate Funtion
     * @param null
     */
    async rotate() {
      const sector = this.sectors[await this.getIndex()]
      // console.log(this.ang, this.PI / 2)
      if (this.ctx && this.ctx.canvas && this.ctx.canvas.style) {
        this.ctx.canvas.style.transform = `rotate(${this.ang - this.PI / 2}rad)`
      }
      // checking the board is rotating or not
      if (this.angVel) {
        // Rotating
        this.EL_spin.textContent = `(${sector.bookNo}/${sector.accountNo})`
        // Showing the sweetalert
        // Swal.fire(`The this.winner is ${sector.bookNo}`);
        this.winner = sector
      } else {
        this.processWinner(sector)
      }
      if (this.EL_spin && sector) {
        this.EL_spin.style.background = sector.color
      }
    },
    /**
     * Frame Funtion
     * @param null
     */
    frame() {
      if (!this.angVel) return
      this.angVel *= this.friction // Decrement velocity by this.friction
      if (this.angVel < 0.002) this.angVel = 0 // Bring to stop
      this.ang += this.angVel // Update angle
      this.ang %= this.TAU // Normalize angle
      this.rotate()
    },
    /**
     * Engine Funtion
     * @param null
     */
    engine() {
      this.frame()
      requestAnimationFrame(this.engine)
    },
    /**
     * Removing the Winner from the list
     * @param sector
     */
    processWinner(sector) {
      // removing the sector
      if (this.isWheelSpinning === true && this.winner) {
        let processedPosition = 'N/A'
        /** Switch the winner position */
        switch (this.winnerPosition) {
          case 10: {
            processedPosition = 'দশম'
            break
          }
          case 9: {
            processedPosition = 'নবম'
            break
          }
          case 8: {
            processedPosition = 'অষ্টম'
            break
          }
          case 7: {
            processedPosition = 'সপ্তম'
            break
          }
          case 6: {
            processedPosition = 'ষষ্ট'
            break
          }
          case 5: {
            processedPosition = 'পঞ্চম'
            break
          }
          case 4: {
            processedPosition = 'চতুর্থ'
            break
          }
          case 3: {
            processedPosition = 'তৃতীয়'
            break
          }
          case 2: {
            processedPosition = 'দ্বিতীয়'
            break
          }
          case 1: {
            processedPosition = 'প্রথম'
            this.EL_spin.removeEventListener('click', this.clickHandler)
            break
          }
          default:
            break
        }
        // Showing the Winner Details
        Swal.fire({
          title: 'স্বাগতম!',
          text: `${sector.name}(${sector.bookNo}/${sector.accountNo}), আপনি ${processedPosition} পুরষ্কারের জন্য নির্বাচিত হয়েছেন।`,
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
          // background: "#fff url(./lottery3.gif)",
          backdrop: `rgba(0,0,123,0.4) url("./images/lottery5.gif") no-repeat
  `,
          icon: 'warning',
          // showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'আবার দেখুন',
        }).then(async (result) => {
          if (result.isConfirmed) {
            // Removing the this.winner from the list
            const findIndex = this.sectors
              .map((sector) => sector.bookNo)
              .indexOf(sector.bookNo)
            if (findIndex > -1) {
              // attaching the result
              // document.getElementById(
              //   `${this.winnerPosition}`
              // ).innerText = `${processedPosition} পুরস্কারঃ ${sector.name}(বই নংঃ ${sector.bookNo} হিসাব নংঃ ${sector.accountNo})`
              this.winnerList.push({
                position: `${this.winnerPosition.toLocaleString(
                  'bn-BD'
                )} পুরস্কারঃ `,
                winner: this.sectors[findIndex],
              })
              // Writing file
              await this.writeWinnerToFile(
                this.sectors[findIndex],
                processedPosition
              )
              // Sending the Winning SMS to the consumer mobile no
              // await this.sendSMSToMobile(
              //   this.sectors[findIndex],
              //   processedPosition
              // )
              this.sectors.splice(findIndex, 1)
              // Redrawing the Canvas
              this.initializeVariables()
              this.sectors.forEach(this.drawSector)
              this.EL_spin.textContent = `শুরু`
            }
            this.winnerPosition =
              this.winnerPosition > 0 ? this.winnerPosition - 1 : 0
            this.winner = null
            this.isWheelSpinning = false
          }
        })
      }
    },
    /**
     * Writing the winner to the file for safety
     */
    writeWinnerToFile(winner, position) {
      try {
        // Send request to nuxt server-side to get refresh token from Backend api
        this.$axios
          .post(`http://localhost:3000/server/write-winner`, {
            winner,
            position,
          })
          .then((response) => {
            if (response.status === 200) {
              // set new access token
              console.log('success')
            }
          })
          .catch((e) => {
            console.log(e)
          })
      } catch (error) {
        console.log(error)
      }
    },

    /**
     * Environment Initializations Funtion
     * @param null
     */
    initializeVariables() {
      this.tot = this.sectors.length
      this.arc = this.TAU / (this.sectors.length || 1)
    },
    /**
     * Sending Winning SMS to the mobile
     * @param {Object} sector
     * @param {String} position
     */
    async sendSMSToMobile({ name, mobileNo }, position) {
      try {
        const SMS_USER = 'bholapbs' // 'dhakapbs3'
        const SMS_PASSWORD = 'bholapbs' // 'dhakapbs3'
        const SMS_MOBILE = mobileNo
        const SMS_CONTENT = `অভিনন্দন ${name}।ভোলা পল্লী বিদ্যুৎ সমিতির পক্ষ থেকে আপনি ${position} পুরষ্কারের জন্য মনোনীত হয়েছেন।`
        const SMS_CHARSET = 'UTF-8'
        const processedURL = `http://bulksms2.teletalk.com.bd/link_sms_send.php?op=SMS&user=${SMS_USER}&pass=${SMS_PASSWORD}&mobile=88${SMS_MOBILE}&sms=${SMS_CONTENT}&charset=${SMS_CHARSET}`
        // Sending OTP to the Provided Number
        await this.$axios
          .$get(encodeURI(processedURL))
          .then((result) => {
            if (result && result.data && result.data.includes('SUCCESS')) {
              console.log('success')
              // SUCCESS
            }
          })
          .catch((error) => {
            console.log(error)
            // console.log('success')
            // ERROR
          })
      } catch (error) {
        console.log(error)
        // ERROR
      }
    },
    /**
     * Removing the duplicate account frm data list
     */
    removingDuplicateList() {
      try {
        // console.log(this.consumers)
        this.consumers.map(
          (consumer) => (consumer.smsNo = consumer.bookNo + consumer.accountNo)
        )
        // console.log(this.consumers)
        const result = []
        const map = new Map()
        for (const item of this.consumers) {
          if (!map.has(item.smsNo)) {
            map.set(item.smsNo, true) // set any value to Map
            result.push(item)
          }
        }
        console.log(result)
        this.consumers = result
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style lang="css" scoped>
#app {
  margin: auto;
  width: 100%;
  border: 3px solid rgb(128, 0, 70);
  padding: 5px;
}
#wheelOfFortune {
  display: inline-block;
  position: relative;
  overflow: hidden;
  margin-left: 5%;
}

#wheel {
  display: block;
}

#spin {
  font: 1em/0 sans-serif;
  user-select: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 26%;
  height: 26%;
  margin: -13%;
  background: #fff;
  color: #fff;
  box-shadow: 0 0 0 8px currentColor, 0 0px 15px 5px rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  transition: 0.8s;
}

#spin::after {
  content: '';
  position: absolute;
  top: -17px;
  border: 10px solid transparent;
  border-bottom-color: currentColor;
  border-top: none;
}
/* Curtain Effect */
.rnOuter {
  background: hsl(0, 80%, 38%);
  overflow: hidden;
  position: relative;
  height: 100vh;
}
.rnInner {
  width: 100%;
  position: absolute;
  top: -10%;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  transform-style: preserve-3d;
  transition: transform 6s ease;
  transform-origin: -120% top;
}
.rnUnit {
  width: 10vw;
  height: 120vh;
  background: repeating-linear-gradient(
    to left,
    hsl(0, 80%, 50%) 4vw,
    hsl(0, 80%, 30%) 8vw,
    hsl(0, 80%, 70%) 10vw
  );
  background-size: 100% 100%;
  display: inline-block;
  transform-origin: 0 0%;
  transform: rotate(3deg);
  -webkit-animation: rnUnit 2s ease infinite;
  animation: rnUnit 2s ease infinite;
}
@-webkit-keyframes rnUnit {
  50% {
    transform: rotate(-3deg);
  }
}
@keyframes rnUnit {
  50% {
    transform: rotate(-3deg);
  }
}
.rnUnit:nth-child(1) {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}
.rnUnit:nth-child(2) {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
.rnUnit:nth-child(3) {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
.rnUnit:nth-child(4) {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
.rnUnit:nth-child(5) {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.rnUnit:nth-child(6) {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
.rnUnit:nth-child(7) {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
.rnUnit:nth-child(8) {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.rnUnit:nth-child(9) {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.rnUnit:nth-child(10) {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.rnUnit:nth-child(11) {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.aoTable {
  display: table;
  width: 100%;
  height: 100vh;
  text-align: center;
}
.aoTableCell {
  color: hsl(0, 80%, 38%);
  display: table-cell;
  vertical-align: middle;
  transition: color 3s ease;
}
/* .rnOuter:hover .rnInner {
  transform-origin: -120% top;
  transform: scaleX(0);
} */
/* .rnInner {
  transform-origin: -120% top;
  transform: scaleX(0);
} */
.rnOuter:hover .aoTableCell {
  color: white;
}
</style>
