import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2';
import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.3.0/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  name: string = ''
  alert: boolean = false

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  signatureEndpoint = 'https://zoomsignature.bpssumsel.com'
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  sdkKey = 'wPBUtlhh9Y0R5FctIXKQjFBP64SNqOAeMk3C'
  meetingNumber = '94047898654'
  role = 0
  leaveUrl = 'https://cazi.bpssumsel.com'
  userName = 'Cazi'
  userEmail = ''
  passWord = '924469'
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
  registrantToken = ''

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {

  }

  ngOnInit() {

  }

  getSignature(name: string, wilayah: string) {
    if ((name == null || name == "") || (wilayah == null || wilayah == "")) {
      this.alert = true
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Nama & wilayah harus diisi!',
      })
    } else {
      this.userName = wilayah + "_" + name
      console.log('it does nothing', name, wilayah)

      this.httpClient.post(this.signatureEndpoint, {
        meetingNumber: this.meetingNumber,
        role: this.role
      }).toPromise().then((data: any) => {
        if (data.signature) {
          console.log(data.signature)
          this.startMeeting(data.signature)
        } else {
          console.log(data)
        }
      }).catch((error) => {
        console.log(error)
      })
    }

  }

  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: this.leaveUrl,
      success: (success) => {
        console.log(success)
        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.userName,
          sdkKey: this.sdkKey,
          userEmail: this.userEmail,
          passWord: this.passWord,
          tk: this.registrantToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
}
