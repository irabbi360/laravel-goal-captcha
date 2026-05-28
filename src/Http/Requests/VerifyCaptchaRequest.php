<?php

namespace Irabbi360\LaravelGoalCaptcha\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class VerifyCaptchaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'captcha_id'     => ['required', 'string', 'uuid'],
            'final_x'        => ['required', 'numeric', 'min:0'],
            'drag_time'      => ['required', 'integer', 'min:0'],
            'movement_track' => ['sometimes', 'array'],
            'movement_track.*.x' => ['required_with:movement_track', 'numeric'],
            'movement_track.*.t' => ['required_with:movement_track', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'captcha_id.required' => 'CAPTCHA token is missing.',
            'captcha_id.uuid'     => 'CAPTCHA token is invalid.',
            'final_x.required'   => 'Ball position is required.',
            'drag_time.required' => 'Drag timing is required.',
        ];
    }
}
