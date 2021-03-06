import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { PropertyDetailsPage } from '../pages/property-details/property-details';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { NotificationsPage } from '../pages/notifications/notifications';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoanDetailsPage } from '../pages/loan-details/loan-details';
import { UploadDocumentsPage } from '../pages/upload-documents/upload-documents';
import { LoanHistoryPage } from '../pages/loan-history/loan-history';
import { SettingsProvider } from '../providers/settings/settings';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  selectedTheme: String;

  pages: Array<{ title: string, icon: string, component: any }>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private push: Push,
    private http: HttpClient,
    private storage: Storage,
    private settings: SettingsProvider
  ) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.pushNotification();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Scan Property', icon: '', component: HomePage },
      { title: 'Notifications', icon: '', component: NotificationsPage },
      { title: 'Loan History', icon: '', component: LoanHistoryPage },
      //{ title: 'Settings', icon: '', component: SettingsPage },
      { title: 'Logout', icon: '', component: LoginPage },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  regid: any;
  pushNotification() {
    if (this.platform.is('cordova')) {
      // to check if we have permission
      this.push.hasPermission()
        .then((res: any) => {

          if (res.isEnabled) {
            console.log('We have permission to send push notifications');
          } else {
            console.log('We do not have permission to send push notifications');
          }

        });

      // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
      this.push.createChannel({
        id: "623706415166",
        description: "My first test channel",
        // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
        importance: 3
      }).then(() => console.log('Channel created'));

      // Delete a channel (Android O and above)
      this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

      // Return a list of currently configured channels
      this.push.listChannels().then((channels) => console.log('List of channels', channels))

      // to initialize push notifications

      const options: PushOptions = {
        android: {
          senderID: '623706415166',
          forceShow: true,
          sound: 'default',
          vibrate: true,
          icon: '',
        },
        ios: {
          alert: 'true',
          badge: true,
          sound: 'default'
        },
        windows: {},
        browser: {
          pushServiceURL: 'http://virtiledge.com/fcm/?id=' + this.regid
        }
      };

      const pushObject: PushObject = this.push.init(options);


      pushObject.on('notification').subscribe((notification: any) => {
        console.log('Received a notification', notification);
        //this.nav.push(NotificationsPage);
        // this.storage.set('')

        setTimeout(() => {
          this.rootPage = LoanDetailsPage;
        }, 0);

      });


      pushObject.on('registration').subscribe((registration: any) => {
        this.storage.remove('registrationId');
        this.storage.set('registrationId', registration.registrationId);
        console.log('Device registered', registration.registrationId);
      });

      pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }
  }
}
