<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    function index()
    {
        // return User::get()
    }

    function show()
    {
    }

    function create(Request $request)
    {

    }

    function update()
    {

    }

    function delete()
    {

    }

    function validate(Request $request)
    {
        return $request->validate([
            'username' => 'required|string|unique:users,username',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'type' => 'required|'
        ]);
    }
}
