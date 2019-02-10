//
//  ComandaViewController.swift
//  zapei
//
//  Created by Izabella Melo on 10/02/19.
//  Copyright © 2019 zapei. All rights reserved.
//

import UIKit
import AVFoundation

var faturaTotal = 0.0
var produtoSelecionado = 0

struct Produto {
    var nome = ""
    var valor = 0.0
}

struct Pedido {
    var mesa = 0
    var prod = Produto()
}

var cardapio = [Produto]()
var pickerTextField = UITextField()

class ComandaViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, UIPickerViewDelegate, UIPickerViewDataSource {
    func numberOfComponents(in pickerView: UIPickerView) -> Int {
        return 1
    }
    
    func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
        return cardapio.count
    }
    
    func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
        return cardapio[row].nome
    }

    func pickerView(_ pickerView: UIPickerView, didSelectRow row: Int, inComponent component: Int) {
        pickerTextField.text = cardapio[row].nome
        produtoSelecionado = row
    }
    
    
    var comandas: [Pedido] = []
    
    var myTableView: UITableView!
    var textfield = UITextField()

    override func viewDidLoad() {
        self.view.backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        self.navigationController?.navigationBar.tintColor = .black;
//        self.navigationController?.navigationBar.topItem?.title = "Mesa \(mesaAtual)"

        let finalizar = UIButton(frame: CGRect(x: self.view.frame.width/2 - (self.view.frame.width - 10)/2, y: self.view.frame.height - 130, width: self.view.frame.width - 10, height: 50))
        finalizar.backgroundColor = #colorLiteral(red: 0.04705882353, green: 0.1333333333, blue: 0.2196078431, alpha: 1)
        finalizar.layer.cornerRadius = 10
        finalizar.setTitle("Encerrar comanda", for: .normal)
        finalizar.addTarget(self, action: #selector(finalizarButtonAction), for: .touchUpInside)
        self.view.addSubview(finalizar)
        
        let pickerView = UIPickerView()
        pickerView.delegate = self
        
        pickerTextField =  UITextField(frame: CGRect(x: self.view.frame.width/2 - (self.view.frame.width - 20)/2, y: 30, width: self.view.frame.width - 10, height: 50))
        pickerTextField.placeholder = "Adicionar um prato"
        pickerTextField.inputView = pickerView
        view.addSubview(pickerTextField)


        let adicionar = UIButton(frame: CGRect(x: self.view.frame.width - 60, y: 30, width: 50, height: 50))
        adicionar.backgroundColor = #colorLiteral(red: 0.04705882353, green: 0.1333333333, blue: 0.2196078431, alpha: 1)
        adicionar.layer.cornerRadius = 10
        adicionar.setTitle("OK", for: .normal)
        adicionar.addTarget(self, action: #selector(adicionarButtonAction), for: .touchUpInside)
        self.view.addSubview(adicionar)
        
        myTableView = UITableView(frame: CGRect(x: 0, y: 80, width: self.view.frame.width, height: self.view.frame.height/2))
        myTableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        myTableView.dataSource = self
        myTableView.delegate = self
        self.view.addSubview(myTableView)
        
        if cardapio.count == 0 {
            povoaArray()
        }
    }
    
    @objc func finalizarButtonAction(sender: UIButton!) {
        sendData()
        
        var index = 0
        for i in mesasIDs {
            if i == mesaAtual {
                mesasIDs.remove(at: index)
                userIDs.remove(at: index)
                self.navigationController?.popViewController(animated: true)
            }
            index += 1
        }
    }
    
    @objc func adicionarButtonAction(sender: UIButton!) {
        comandas.append(Pedido(mesa: mesaAtual, prod: cardapio[produtoSelecionado]))
        print(comandas)
        myTableView.reloadData()
        
        faturaTotal += cardapio[produtoSelecionado].valor
        sendDataUpdate(valor: cardapio[produtoSelecionado].valor, nome: cardapio[produtoSelecionado].nome)
    }
    
    func povoaArray(){
        cardapio.append(Produto(nome: "coca-cola", valor: 10))
        cardapio.append(Produto(nome: "parmegiana", valor: 100))
        cardapio.append(Produto(nome: "macarrao", valor: 50))
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        var number = 0;
        for i in comandas {
            if i.mesa == mesaAtual {
                number += 1
            }
        }
        return number
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath)
        
        if comandas[indexPath.row].mesa == mesaAtual {
            cell.textLabel?.text = comandas[indexPath.row].prod.nome + "  -  R$" + String(comandas[indexPath.row].prod.valor)
        }

        return cell
    }
    
    func sendData() {
        let headers = [
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "ffe960f5-a7a9-e7af-8678-bc75b214c262"
        ]
        

        let postData = NSMutableData(data: ("value=" + String(faturaTotal)).data(using: String.Encoding.utf8)!)
        postData.append(("&id_from=" + userAtual).data(using: String.Encoding.utf8)!)
        postData.append("&id_to=420728565".data(using: String.Encoding.utf8)!)
        
        let request = NSMutableURLRequest(url: NSURL(string: "http://kkjds-michaelbarneyjunior439169.codeanyapp.com:80/comanda")! as URL,
                                          cachePolicy: .useProtocolCachePolicy,
                                          timeoutInterval: 10.0)
        request.httpMethod = "POST"
        request.allHTTPHeaderFields = headers
        request.httpBody = postData as Data
        
        let session = URLSession.shared
        let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
            if (error != nil) {
                print(error)
            } else {
                let httpResponse = response as? HTTPURLResponse
                print(httpResponse)
            }
        })
        
        dataTask.resume()
    }
    
    func sendDataUpdate(valor: Double, nome: String) {
        let headers = [
            "content-type": "application/x-www-form-urlencoded",
            "cache-control": "no-cache",
            "postman-token": "ffe960f5-a7a9-e7af-8678-bc75b214c262"
        ]
        
        
        let postData = NSMutableData(data: ("value=" + String(valor)).data(using: String.Encoding.utf8)!)
        postData.append(("&name=" + nome).data(using: String.Encoding.utf8)!)
        postData.append(("&id_from=" + userAtual).data(using: String.Encoding.utf8)!)
        postData.append("&id_to=420728565".data(using: String.Encoding.utf8)!)
        
        let request = NSMutableURLRequest(url: NSURL(string: "http://kkjds-michaelbarneyjunior439169.codeanyapp.com:80/update")! as URL,
                                          cachePolicy: .useProtocolCachePolicy,
                                          timeoutInterval: 10.0)
        request.httpMethod = "POST"
        request.allHTTPHeaderFields = headers
        request.httpBody = postData as Data
        
        let session = URLSession.shared
        let dataTask = session.dataTask(with: request as URLRequest, completionHandler: { (data, response, error) -> Void in
            if (error != nil) {
                print(error)
            } else {
                let httpResponse = response as? HTTPURLResponse
                print(httpResponse)
            }
        })
        
        dataTask.resume()
    }
    
    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        view.endEditing(true)
    }
    
}
