import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getApiBaseUrl } from '../config/api';

export interface SubjectRecord {
  id: number;
  code: string;
  name: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private readonly apiBaseUrl = getApiBaseUrl();

  constructor(private readonly http: HttpClient) {}

  getSubjects() {
    return this.http.get<SubjectRecord[]>(`${this.apiBaseUrl}/subjects`);
  }

  addSubject(subject: Omit<SubjectRecord, 'id'>) {
    return this.http.post<SubjectRecord>(`${this.apiBaseUrl}/subjects`, subject);
  }

  updateSubject(id: number, subject: Omit<SubjectRecord, 'id'>) {
    return this.http.put<SubjectRecord>(`${this.apiBaseUrl}/subjects/${id}`, subject);
  }

  deleteSubject(id: number) {
    return this.http.delete<void>(`${this.apiBaseUrl}/subjects/${id}`);
  }
}
