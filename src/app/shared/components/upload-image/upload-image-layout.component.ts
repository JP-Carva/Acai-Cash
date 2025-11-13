import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from "ngx-image-cropper";
import { ButtonModule } from "primeng/button";
import { ImageModule } from "primeng/image";
import { Fieldset } from "primeng/fieldset";

@Component({
    selector: "app-upload-image-layout",
    standalone: true,
    templateUrl: "./upload-image-layout.component.html",
    imports: [
    CommonModule,
    DialogModule,
    ImageCropperComponent,
    ButtonModule,
    Fieldset,
    ImageModule
],
})
export class UploadImageLayoutComponent implements OnInit {

    @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
    
    @Input() photoInput = {}  as File;
    @Output() photoChange = new EventEmitter<File | null>();

    photo!: File;
    photoView!: string;
    cropperVisible = false;
    imageChangedEvent: any = '';
    croppedImage: any = '';

    ngOnInit() {
        this.applyPhotoInput(this.photoInput);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['photoInput']) {
            this.applyPhotoInput(changes['photoInput'].currentValue);
        }
    }

    private applyPhotoInput(value: string | File ): void {
        if (typeof value === 'string') {
            this.photoView = `data:image/jpeg;base64,${value}`;
            return;
        }
    }

    fileChangeEvent(event: any): void {
        this.croppedImage = event.objectUrl;
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent): void {
        this.croppedImage = event.objectUrl;
    }

    imageLoaded(event: LoadedImage): void {
        console.log('Image loaded:', event);
        this.cropperVisible = true;
    }

    cleanImage(): void {
        this.photoView = ""
        this.fileInput.nativeElement.value = '';
        this.imageChangedEvent = undefined;
        this.cropperVisible = false;
        this.photoView = undefined!;
        this.photoInput = undefined!;
    }

    desabilitado(): boolean {
        return !this.photoView && !(this.fileInput?.nativeElement?.files?.length);
    }

    confirmCrop() {
        if(!this.croppedImage){
        this.cropperVisible = false;
        return;
        }

        (async () => {
        try {
            const fileName = 'foto.png';

            const response = await fetch(this.croppedImage);
            const blob = await response.blob();
            const mime = blob.type || 'image/png';

            if (this.photoView) {
                URL.revokeObjectURL(this.photoView);
            }

            this.photo = new File([blob], fileName, { type: mime });
            this.photoView = URL.createObjectURL(this.photo);
            this.photoChange.emit(this.photo);

        } catch (err) {
            console.error('Erro ao processar a imagem:', err);
        } finally {
            this.cropperVisible = false;
        }
        })();
    }

}