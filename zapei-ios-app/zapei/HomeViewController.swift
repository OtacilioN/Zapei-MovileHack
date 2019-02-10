//
//  HomeViewController.swift
//  zapei
//
//  Created by Penélope Araújo on 09/02/19.
//  Copyright © 2019 zapei. All rights reserved.
//

import UIKit

var userAtual = ""
var mesaAtual = 0

var userIDs =  [String]()
var mesasIDs =  [Int]()

class HomeViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    var myTableView: UITableView!

    override func viewDidAppear(_ animated: Bool) {
        myTableView.reloadData()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.view.backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        self.navigationController?.navigationBar.topItem?.title = "Mesas"

        print("userIDs", userIDs.count)
        
        let button = UIButton(frame: CGRect(x: self.view.frame.width/2 - 25, y: self.view.frame.height - 150, width: 50, height: 50))
        let image = UIImage(named: "qrcode.png")
        button.setImage(image, for: .normal)
        button.setTitle("Test Button", for: .normal)
        button.addTarget(self, action: #selector(buttonAction), for: .touchUpInside)
        
        self.view.addSubview(button)
        
        myTableView = UITableView(frame: CGRect(x: 0, y: 0, width: self.view.frame.width, height: self.view.frame.height/1.3))
        myTableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        myTableView.dataSource = self
        myTableView.delegate = self
        self.view.addSubview(myTableView)
    }
    
    @objc func buttonAction(sender: UIButton!) {
        self.navigationController?.pushViewController(ViewController(), animated: true)
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return userIDs.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        print(userIDs)
        let cell = tableView.dequeueReusableCell(withIdentifier: "cell", for: indexPath as IndexPath)
        cell.textLabel!.text = "Mesa \(mesasIDs[indexPath.row])"
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        userAtual = userIDs[indexPath.row]
        mesaAtual = mesasIDs[indexPath.row]

        self.navigationController?.pushViewController(ComandaViewController(), animated: true)
    }


}
