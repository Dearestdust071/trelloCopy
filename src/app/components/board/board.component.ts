import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Talk {
  text: string;
}

interface Track {
  title: string;
  talks: Talk[];
}

interface Board {
  title: string;
  tracks: Track[];
}
@Component({
  selector: 'app-board',
  imports: [
    CommonModule
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {


  boards: Board[] = [
    {
      title: "Board 1",
      tracks: [
        {
          title: "Track 1",
          talks: [
            { text: "Talk 1 content" },
            { text: "Talk 2 content" }
          ]
        },
        {
          title: "Track 2",
          talks: [
            { text: "Talk 3 content" }
          ]
        }
      ]
    },
    {
      title: "Board 2",
      tracks: [
        {
          title: "Track 3",
          talks: [
            { text: "Talk 4 content" },
            { text: "Talk 5 content" }
          ]
        }
      ]
    }
  ];


}
