//
//  ViewController.swift
//  zapei
//
//  Created by Penélope Araújo on 09/02/19.
//  Copyright © 2019 zapei. All rights reserved.
//

import UIKit
import AVFoundation

class ViewController: UIViewController, AVCaptureMetadataOutputObjectsDelegate {
    
    var video = AVCaptureVideoPreviewLayer()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.navigationController?.navigationBar.tintColor = .black;

        let session = AVCaptureSession()
        let captureDevice = AVCaptureDevice.default(for: AVMediaType.video)
        do {
            let input = try AVCaptureDeviceInput(device: captureDevice!)
            session.addInput(input)
        }
        catch {
            print("ERROR")
        }
        
        let output = AVCaptureMetadataOutput()
        session.addOutput(output)
        output.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
        output.metadataObjectTypes = [.qr]
        video = AVCaptureVideoPreviewLayer(session: session)
        
        video.frame = view.layer.bounds
        view.layer.addSublayer(video)
        
//        let qrCodeFrameView = UIView()
//        qrCodeFrameView.layer.borderColor = UIColor.green.cgColor
//        qrCodeFrameView.layer.borderWidth = 2
//        view.addSubview(qrCodeFrameView)
//        view.bringSubviewToFront(qrCodeFrameView)
        //exibe o contorno bonitinho do qr code mas começou a bugar depois de eu acrescentar novas views (????)
        
        session.startRunning()
        
    }
    
    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        var capturouQrCode = false
        if metadataObjects.count > 0 && !capturouQrCode {
            if let object = metadataObjects[0] as? AVMetadataMachineReadableCodeObject {
                if object.type == AVMetadataObject.ObjectType.qr {
                    
                    capturouQrCode = true
                    let alert = UIAlertController(title: "Digite o número da mesa", message: "", preferredStyle: .alert)
                    var mesa = 0
                    
                    alert.addTextField { (textField) in
                        mesa = Int(textField.text!) ?? -1;
                        textField.keyboardType = .numberPad
                    }
                    
                    let yesAction = UIAlertAction(title: "Ok", style: .default, handler: { _ -> Void in
                        if object.stringValue != nil {
                            let textField = alert.textFields![0]
                            mesa = Int(textField.text!) ?? -1
                            userIDs.append(object.stringValue!)
                            mesasIDs.append(mesa)
                            
                            self.navigationController?.popViewController(animated: true)
                        }
                        else {
                            print("error");
                        }
                    })
                    
                    let noAction = UIAlertAction(title: "Cancelar", style: .default, handler: { _ -> Void in
                        capturouQrCode = false
                    })
                    
                    alert.addAction(noAction)
                    alert.addAction(yesAction)

                    present(alert, animated: false, completion: nil)

                }
            }
        }
    }
    
}
