import { Component, OnInit } from '@angular/core';

import { Invoices } from './shared/invoices.constant';
import { Play } from './shared/play.constant';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'refactoring';
  invoice;
  play;
  performances;
  objectInvoice;

  ngOnInit() {
    this.invoice = Invoices;
    this.play = Play;
    this.objectInvoice = this.invoice[0];
    console.log(this.objectInvoice);
    console.log(this.statement(this.objectInvoice, this.play));
  }

  statementOld(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat('en-US',
                        { style: 'currency', currency: 'USD',
                          minimumFractionDigits: 2}).format;
    for (const perf of invoice.performances) {
      const play = plays[perf.playID];
      let thisAmount = 0;

      switch (play.type) {
        case 'tragedy':
          thisAmount = 40000;
          if (perf.audience > 30) {
            thisAmount += 1000 * (perf.audience - 30);
          }
          break;
        case 'comedy':
          thisAmount = 30000;
          if (perf.audience > 20) {
            thisAmount += 1000 + 500 * (perf.audience - 20);
          }
          thisAmount += 300 * perf.audience;
          break;
        default:
          throw new Error(`unknow type: ${play.type}`);
      }
      // add volume credits
      volumeCredits += Math.max(perf.audience - 30, 0);
      // add extra credit for every ten comedy attendees
      if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);

      // print line for this order
      result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
      totalAmount += thisAmount;
    }

    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result;
  }

  statement(invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`;
    for (const perf of invoice.performances) {
      // print line for this order
      result += ` ${this.playFor(perf).name}: ${this.usd(this.amountFor(perf))} (${perf.audience} seats)\n`;
    }

    result += `Amount owed is ${this.usd(this.totalAmount(invoice))}\n`;
    result += `You earned ${this.totalVolumeCredits(invoice)} credits \n`;
    return result;
  }

  amountFor(aPerformance) {
    let result = 0;
    switch (this.playFor(aPerformance).type) {
      case 'tragedy':
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy':
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 1000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`unknow type: ${this.playFor(aPerformance).type}`);
    }
    return result;
  }

  playFor(aPerformance) {
    return this.play[aPerformance.playID];
  }

  volumenCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === this.playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  usd(aNumber) {
    return new Intl.NumberFormat('en-US',
      {
        style: 'currency', currency: 'USD',
        minimumFractionDigits: 2
      }).format(aNumber / 100);
  }

  totalVolumeCredits(invoice) {
    let result = 0;
    for (const perf of invoice.performances) {
      result += this.volumenCreditsFor(perf);
    }
    return result ;
  }

  totalAmount(invoice) {
    let result = 0;
    for (const perf of invoice.performances) {
      result += this.amountFor(perf);
    }
    return result;
  }




}
