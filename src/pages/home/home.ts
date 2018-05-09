import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Toast } from '@ionic-native/toast';
import jQuery from "jquery";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private camera: Camera, private toast: Toast) {

  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      let base64Image = this.convertToArray(imageData);
      
      var subscriptionKey = "5f5d1e8ead2c4e0a87473a4cda37509f";

      var uriBase = "https://southcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
      var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
      };

      this.toast.show(`Deu`, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );

      jQuery.ajax({
        url: uriBase + "?" + jQuery.param(params),

        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body.
        data: '{"url": ' + '"' + base64Image + '"}',
    })
    .done(function(data) {
        // Show formatted JSON on webpage.
        jQuery("#vdc").text("JOAO");
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        // Display error message.
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        jQuery("#vdc").text(errorString);
        
    });
      
    }, (err) => {
      console.log('NÃO DEU');
    });
  }

  convertToArray(s) {
    var byteChars = atob(s);
    var l = byteChars.length;
    var byteNumbers = new Array(l);
    for (var i = 0; i < l; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  }

}
