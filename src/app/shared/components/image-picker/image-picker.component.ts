import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import {
  Capacitor,
  Plugins,
  CameraSource,
  CameraResultType,
} from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() selectedDataImage = new EventEmitter<string>();
  @Output() selectedImage = new EventEmitter<string>();
  @Output() selectedFile = new EventEmitter<File>();
  @ViewChild('filePicker', { static: false }) filePicker: ElementRef;
  usePicker = false;
  hideCameraTooltip: boolean;
  storage = Plugins.Storage;

  constructor(
    private alertController: AlertController,
    private platform: Platform
  ) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }

    this.setCameraTooltip();
  }

  onOpenCamera() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePicker.nativeElement.click();
      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64,
    })
      .then((image) => {
        var blob = new Blob([image.base64String], { type: image.format });
        var file = new File([blob], image.path);
        this.selectedFile.emit(file);

        this.selectedImage.emit(image.base64String);
        this.selectedDataImage.emit(
          `data:image/${image.format};base64, ${image.base64String}`
        );
      })
      .catch((err) => {
        if (this.usePicker) {
          this.filePicker.nativeElement.click();
        } else {
          this.alertController
            .create({
              message: err,
              buttons: [{ text: 'OK', role: 'cancel' }],
            })
            .then((alertEl) => alertEl.present());
        }

        return false;
      });
  }

  onFileChosen(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (!file) {
      return;
    }

    this.selectedFile.emit(file);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const image = fileReader.result.toString();
      this.selectedDataImage.emit(image);
      // strip the data:image part from a base64 string of any image type
      this.selectedImage.emit(image.replace(/^data:image\/[a-z]+;base64,/, ''));
    };
    fileReader.readAsDataURL(file);
  }

  async setCameraTooltip() {
    this.hideCameraTooltip = !!(
      await this.storage.get({ key: 'hideCameraTooltip' })
    ).value;
    if (!this.hideCameraTooltip) {
      await this.storage.set({ key: 'hideCameraTooltip', value: 'true' });
    }
  }

  showCameraTooltip() {
    this.hideCameraTooltip = true;
    this.alertController
      .create({
        message: `Take a photo, upload it, let us identify it with our 'magic' and view the results in seconds.`,
        buttons: [
          {
            text: 'ok',
            handler: () => {
              this.onOpenCamera();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }
}
