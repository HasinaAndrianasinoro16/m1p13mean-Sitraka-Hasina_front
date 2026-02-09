import { Component, OnInit } from '@angular/core';
import {ProfileService} from "../../services/profile/profile.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any = null;
  loading: boolean = false;
  error: string = '';

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.error='';

    this.profileService.getProfileBoutique().subscribe({
      next: (res: any) => {
        if(res.success){
          this.profile = res.data.boutique;
        }
      },
      error: (err) => {
        console.error(err);
        this.error = "Erreur lors de la récupération des boutiques validées.";
      }
    });
  }

}
